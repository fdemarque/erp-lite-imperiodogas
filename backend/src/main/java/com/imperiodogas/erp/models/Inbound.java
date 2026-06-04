package com.imperiodogas.erp.models;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import java.time.OffsetDateTime;
import java.util.UUID;
import java.util.List;
import java.util.ArrayList;

@Data
@Entity
@Table(name = "inbounds")
public class Inbound {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "invoice_number", nullable = false)
    @JsonProperty("invoice_number")
    private String invoiceNumber;

    @Column(name = "truck_plate", nullable = false)
    @JsonProperty("truck_plate")
    private String truckPlate;

    @Column(name = "status")
    @JsonProperty("status")
    private String status;

    @Column(name = "total_amount")
    @JsonProperty("total_amount")
    private java.math.BigDecimal totalAmount;

    @Column(name = "created_by")
    @JsonProperty("created_by")
    private UUID createdBy;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    @JsonProperty("created_at")
    private OffsetDateTime createdAt;

    @Column(name = "finalized_at")
    @JsonProperty("finalized_at")
    private OffsetDateTime finalizedAt;

    @OneToMany(mappedBy = "inbound", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonProperty("items")
    private List<InboundItem> items = new ArrayList<>();
}
