package com.nisanth.billingsoftware.repository;

import com.nisanth.billingsoftware.entity.OrderEntity;
import com.nisanth.billingsoftware.entity.OrderItemEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderItemEntityRepository extends JpaRepository<OrderItemEntity,Long> {

    List<OrderItemEntity> findByItemId(String itemId);
}
