package com.nisanth.billingsoftware.service.impl;

import com.nisanth.billingsoftware.entity.ItemEntity;
import com.nisanth.billingsoftware.entity.OrderItemEntity;
import com.nisanth.billingsoftware.repository.ItemRepository;
import com.nisanth.billingsoftware.repository.OrderItemEntityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class StockPredictionService {

    @Autowired
    private OrderItemEntityRepository orderItemRepository;

    @Autowired
    private ItemRepository itemRepository;

    // Calculate average daily sales
    public double calculateAverageSales(String itemId) {
        List<OrderItemEntity> orders = orderItemRepository.findByItemId(itemId);

        if (orders.isEmpty()) return 0.0;

        // Group sales by order date
        Map<LocalDate, Integer> dailySales = orders.stream()
                .filter(orderItem -> orderItem.getOrder() != null && orderItem.getOrder().getCreatedAt() != null)
                .collect(Collectors.groupingBy(
                        orderItem -> orderItem.getOrder().getCreatedAt().toLocalDate(),
                        Collectors.summingInt(orderItem -> {
                            Integer qty = orderItem.getQuantity();
                            return (qty != null) ? qty : 0; // ✅ prevent null pointer
                        })
                ));

        // Average daily sales
        return dailySales.values().stream()
                .mapToInt(Integer::intValue)
                .average()
                .orElse(0.0);
    }

    // Predict days until out of stock
    private double predictDaysUntilOutOfStock(ItemEntity item, double avgDailySales) {
        Integer quantityObj = item.getQuantity();
        int quantity = (quantityObj != null) ? quantityObj : 0; // ✅ prevent null

        if (avgDailySales <= 0) {
            return Double.POSITIVE_INFINITY; // Not selling
        }
        return quantity / avgDailySales;
    }

    // Predict for all items
    public List<Map<String, Object>> getAllPredictions() {
        List<ItemEntity> items = itemRepository.findAll();

        return items.stream().map(item -> {
            double avgSales = calculateAverageSales(item.getItemId());
            double daysLeft = predictDaysUntilOutOfStock(item, avgSales); // ✅ fixed parameters

            Map<String, Object> map = new HashMap<>();
            map.put("itemId", item.getItemId());
            map.put("itemName", item.getName());
            map.put("quantity", item.getQuantity());
            map.put("avgSales", Math.round(avgSales * 100.0) / 100.0);
            map.put("predictedDaysLeft", Double.isInfinite(daysLeft) ? "Not selling" : Math.round(daysLeft));
            return map;
        }).collect(Collectors.toList());
    }
}
