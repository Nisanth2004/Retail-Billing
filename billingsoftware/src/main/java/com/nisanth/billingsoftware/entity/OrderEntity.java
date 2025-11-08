package com.nisanth.billingsoftware.entity;

import com.nisanth.billingsoftware.io.PaymentDetails;
import com.nisanth.billingsoftware.io.PaymentMethod;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "tbl_orders")
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
public class OrderEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String orderId;
    private String customerName;
    private String phoneNumber;
    private Double subtotal;
    private Double tax;
    private Double grandTotal;
    private LocalDateTime createdAt;
    @Enumerated(EnumType.STRING)
    private PaymentMethod paymentMethod;


    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderItemEntity> items = new ArrayList<>();

    public void addItem(OrderItemEntity item) {
        items.add(item);
        item.setOrder(this);
    }



    @Embedded
    private PaymentDetails paymentDetails;




    // before going to save in db we call this method
    @PrePersist
    protected void onCreate()
    {
        this.orderId="ORD"+System.currentTimeMillis();
        this.createdAt=LocalDateTime.now();
    }

}
