package com.imperiodogas.erp.models;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.Data;
import java.util.UUID;

@Data
@Entity
@Table(name = "order_items")
public class OrderItem {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "order_id")
    private Order order;

    @ManyToOne
    @JoinColumn(name = "inbound_item_id")
    @JsonProperty("inboundItem")
    private InboundItem inboundItem;

    @Column(name = "quantity")
    @JsonProperty("quantity")
    private Integer quantity;

    @Column(name = "unit_price")
    @JsonProperty("unitPrice")
    private java.math.BigDecimal unitPrice;
    
    @Column(name = "subtotal", insertable = false, updatable = false)
    private java.math.BigDecimal subtotal;
}
