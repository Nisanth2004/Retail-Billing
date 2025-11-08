package com.nisanth.billingsoftware.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.nisanth.billingsoftware.io.ItemRequest;
import com.nisanth.billingsoftware.io.ItemResponse;
import com.nisanth.billingsoftware.service.impl.ItemServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;

@RestController
@RequiredArgsConstructor
public class ItemController {

    private final ItemServiceImpl itemService;

    @PostMapping("/admin/items")
    @ResponseStatus(HttpStatus.CREATED)
    public ItemResponse addItem(@RequestPart("item") String itemString,
                                @RequestPart("file") MultipartFile file) {
        ObjectMapper mapper = new ObjectMapper();
        try {
            ItemRequest itemRequest = mapper.readValue(itemString, ItemRequest.class);
            return itemService.add(itemRequest, file);
        } catch (JsonProcessingException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Error processing JSON");
        }
    }

    @GetMapping("/items")
    public List<ItemResponse> readItems() {
        return itemService.fetchItems();
    }

    @DeleteMapping("/admin/items/{itemId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void removeItem(@PathVariable String itemId) {
        itemService.deleteItem(itemId);
    }

    // ✅ Add stock manually
    @PutMapping("/admin/items/{itemId}/stock")
    @ResponseStatus(HttpStatus.OK)
    public ItemResponse updateStock(@PathVariable String itemId,
                                    @RequestParam int addedQuantity) {
        return itemService.addStock(itemId, addedQuantity);
    }
}
