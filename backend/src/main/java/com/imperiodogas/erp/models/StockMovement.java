package com.imperiodogas.erp.models;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.UUID;
import org.hibernate.annotations.CreationTimestamp;

@Data
@Entity
@Table(name = "stock_movements")
public class StockMovement {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "movement_type")
    @JsonProperty("movement_type")
    private String movementType; // ENTRADA | SAIDA

    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;

    private Integer quantity;

    @Column(name = "unit_price")
    @JsonProperty("unit_price")
    private Double unitPrice;

    @Column(name = "invoice_number")
    @JsonProperty("invoice_number")
    private String invoiceNumber;

    @Column(name = "truck_plate")
    @JsonProperty("truck_plate")
    private String truckPlate;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    @JsonProperty("created_at")
    private LocalDateTime createdAt;
}
