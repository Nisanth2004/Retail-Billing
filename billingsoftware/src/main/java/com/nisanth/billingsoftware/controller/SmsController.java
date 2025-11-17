package com.nisanth.billingsoftware.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/admin/sms")
public class SmsController {

    // Read API KEY from application.properties
    @Value("${fast2sms.api.key}")
    private String apiKey;

    @PostMapping("/send")
    public ResponseEntity<?> sendSms(@RequestBody Map<String, String> body) {

        String phone = body.get("phone");
        String message = body.get("message");

        String url = "https://www.fast2sms.com/dev/bulkV2";

        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.set("authorization", apiKey);
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, Object> reqBody = new HashMap<>();
        reqBody.put("route", "q");  // fast sms
        reqBody.put("message", message);
        reqBody.put("language", "english");
        reqBody.put("flash", 0);
        reqBody.put("numbers", phone);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(reqBody, headers);

        try {
            ResponseEntity<String> response =
                    restTemplate.exchange(url, HttpMethod.POST, entity, String.class);

            return ResponseEntity.ok(response.getBody());
        } catch (Exception e) {
            e.printStackTrace(); // <-- see actual backend error
            return ResponseEntity.status(500).body("SMS sending failed");
        }
    }

}
