package com.nisanth.billingsoftware.controller;

import com.nisanth.billingsoftware.io.OrderResponse;
import com.nisanth.billingsoftware.io.PaymentRequest;
import com.nisanth.billingsoftware.io.PaymentVerificationRequest;
import com.nisanth.billingsoftware.io.RazorPayOrderResponse;
import com.nisanth.billingsoftware.service.OrderService;
import com.nisanth.billingsoftware.service.RazorpayService;
import com.razorpay.RazorpayException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final RazorpayService razorpayService;
    private final OrderService orderService;

    @PostMapping("/create-order")
    @ResponseStatus(HttpStatus.CREATED)
    public RazorPayOrderResponse createRazorpayOrder(@RequestBody PaymentRequest request)throws RazorpayException
    {
        return razorpayService.createOrder(request.getAmount(),request.getCurrency());
    }

    @PostMapping("/verify")
    public OrderResponse verifyPayment(@RequestBody PaymentVerificationRequest request)
    {
       return orderService.verifyPayment(request);

    }
}
