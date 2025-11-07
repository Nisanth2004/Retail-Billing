package com.nisanth.billingsoftware.controller;

import com.nisanth.billingsoftware.io.OrderRequest;
import com.nisanth.billingsoftware.io.OrderResponse;
import com.nisanth.billingsoftware.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/orders")
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public OrderResponse createOrder(@RequestBody OrderRequest request)
    {
        return orderService.createOrder(request);

    }


    @DeleteMapping("/{orderId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteOrder(@PathVariable String orderId)
    {
        orderService.deleteOrder(orderId);

    }


    @GetMapping("/latest")
    public List<OrderResponse> getLatestOrders()
    {
        return orderService.getlatestOrders();
    }
}
