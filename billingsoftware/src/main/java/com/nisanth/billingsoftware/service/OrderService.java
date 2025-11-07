package com.nisanth.billingsoftware.service;

import com.nisanth.billingsoftware.io.OrderRequest;
import com.nisanth.billingsoftware.io.OrderResponse;
import com.nisanth.billingsoftware.io.PaymentVerificationRequest;

import java.awt.print.Pageable;
import java.time.LocalDate;
import java.util.List;

public interface OrderService {
   OrderResponse createOrder(OrderRequest request);
  void deleteOrder(String orderId);
  List<OrderResponse> getlatestOrders();

  OrderResponse verifyPayment(PaymentVerificationRequest request);

  Double sumSalesPerDay(LocalDate date);
  Long countByOrderDate(LocalDate date);
 List<OrderResponse> findRecentOrders();
}
