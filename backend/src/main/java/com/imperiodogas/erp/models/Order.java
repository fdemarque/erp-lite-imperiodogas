package com.imperiodogas.erp.models;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.type.SqlTypes;
import java.time.OffsetDateTime;
import java.util.UUID;
import java.util.List;

@Data
@Entity
@Table(name = "orders")
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "client_id", nullable = true)
    @JsonProperty("clients")
    private Client client;

    @Column(name = "delivery_driver_id")
    @JsonProperty("delivery_driver_id")
    private UUID deliveryDriverId;

    @Column(name = "delivery_address_id")
    @JsonProperty("delivery_address_id")
    private UUID deliveryAddressId;

    @Enumerated(EnumType.STRING)
    @JdbcTypeCode(SqlTypes.NAMED_ENUM)
    @Column(name = "sale_type", columnDefinition = "sale_type", nullable = false)
    @JsonProperty("sale_type")
    private SaleType saleType;

    @Enumerated(EnumType.STRING)
    @JdbcTypeCode(SqlTypes.NAMED_ENUM)
    @Column(name = "status", columnDefinition = "order_status")
    @JsonProperty("status")
    private OrderStatus status;

    @Column(name = "due_date")
    @JsonProperty("due_date")
    private java.time.LocalDate dueDate;

    @Column(name = "total_amount")
    @JsonProperty("total_amount")
    private java.math.BigDecimal totalAmount;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    @JsonProperty("created_at")
    private OffsetDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    @JsonProperty("updated_at")
    private OffsetDateTime updatedAt;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonProperty("items")
    private List<OrderItem> items;
}
