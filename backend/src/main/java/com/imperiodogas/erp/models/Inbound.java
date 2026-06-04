package com.imperiodogas.erp.models;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.UUID;
import org.hibernate.annotations.CreationTimestamp;

@Data
@Entity
@Table(name = "inbounds")
public class Inbound {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "invoice_number")
    @JsonProperty("invoice_number")
    private String invoiceNumber;

    @Column(name = "truck_plate")
    @JsonProperty("truck_plate")
    private String truckPlate;

    @Column(name = "status")
    @JsonProperty("status")
    private String status;

    @Column(name = "total_amount")
    @JsonProperty("totalAmount")
    private java.math.BigDecimal totalAmount;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    @JsonProperty("created_at")
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "inbound", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonProperty("items")
    private java.util.List<InboundItem> items = new java.util.ArrayList<>();
}
