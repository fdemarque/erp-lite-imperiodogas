package com.imperiodogas.erp.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.Data;
import lombok.ToString;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import java.util.UUID;

@Data
@Entity
@Table(name = "inbound_items")
public class InboundItem {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "inbound_id")
    @JsonIgnore
    @ToString.Exclude
    private Inbound inbound;

    @Enumerated(EnumType.STRING)
    @JdbcTypeCode(SqlTypes.NAMED_ENUM)
    @Column(name = "category", columnDefinition = "product_category")
    @JsonProperty("category")
    private ProductCategory category;

    @Column(name = "available_quantity")
    @JsonProperty("availableQuantity")
    private Integer availableQuantity;

    @Column(name = "quantity")
    @JsonProperty("quantity")
    private Integer quantity;

    @Column(name = "unit_cost")
    @JsonProperty("unitCost")
    private java.math.BigDecimal unitCost;

    @Column(name = "subtotal", insertable = false, updatable = false)
    @JsonProperty("subtotal")
    private java.math.BigDecimal subtotal;
}
