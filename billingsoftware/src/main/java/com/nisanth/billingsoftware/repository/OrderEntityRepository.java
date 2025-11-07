package com.nisanth.billingsoftware.repository;

import com.nisanth.billingsoftware.entity.OrderEntity;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface OrderEntityRepository extends JpaRepository<OrderEntity,Long> {
   Optional<OrderEntity> findByOrderId(String orderId);

  List<OrderEntity> findAllByOrderByCreatedAtDesc();



     //add all the amount for particular date
    // date will passed in parameter
     @Query("SELECT SUM(o.grandTotal) FROM OrderEntity  o WHERE DATE(o.createdAt)=:date")
     Double sumSalesByDate(@Param("date")LocalDate date);


     @Query("SELECT COUNT(o) FROM OrderEntity o WHERE DATE(o.createdAt)=:date")
     Long countByOrderDate(@Param("date")LocalDate date);


     @Query("SELECT o FROM OrderEntity o ORDER BY o.createdAt DESC")
     List<OrderEntity> findRecentOrders(PageRequest of);
}
