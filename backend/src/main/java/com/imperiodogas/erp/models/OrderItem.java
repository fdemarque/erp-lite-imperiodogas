package com.imperiodogas.erp.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.Data;
import lombok.ToString;
import java.util.UUID;

@Data
@Entity
@Table(name = "order_items")
public class OrderItem {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "order_id", nullable = false)
    @JsonIgnore
    @ToString.Exclude
    private Order order;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "inbound_item_id", nullable = false)
    @JsonProperty("inbound_item")
    private InboundItem inboundItem;

    @Column(name = "quantity", nullable = false)
    @JsonProperty("quantity")
    private Integer quantity;

    @Column(name = "unit_price", nullable = false)
    @JsonProperty("unit_price")
    private java.math.BigDecimal unitPrice;

    @Column(name = "subtotal", insertable = false, updatable = false)
    @JsonProperty("subtotal")
    private java.math.BigDecimal subtotal;
}
