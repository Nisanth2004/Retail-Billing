package com.nisanth.billingsoftware.repository;

import com.nisanth.billingsoftware.entity.OrderItemEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderItemEntityRepository extends JpaRepository<OrderItemEntity,Long> {
}
