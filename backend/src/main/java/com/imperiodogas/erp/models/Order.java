package com.imperiodogas.erp.models;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.UUID;
import org.hibernate.annotations.CreationTimestamp;

@Data
@Entity
@Table(name = "orders")
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "sale_type")
    @JsonProperty("sale_type")
    private String saleType;

    @Column(name = "status")
    @JsonProperty("status")
    private String status;

    @Column(name = "total_amount")
    @JsonProperty("total_amount")
    private java.math.BigDecimal totalAmount;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    @JsonProperty("created_at")
    private LocalDateTime createdAt;

    @ManyToOne
    @JoinColumn(name = "client_id")
    @JsonProperty("clients")
    private Client client;

    @Column(name = "delivery_driver_id")
    @JsonProperty("delivery_driver_id")
    private UUID deliveryDriverId;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonProperty("items")
    private java.util.List<OrderItem> items;
}
