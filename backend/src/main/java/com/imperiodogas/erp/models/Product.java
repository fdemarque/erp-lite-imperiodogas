package com.imperiodogas.erp.models;

import jakarta.persistence.*;
import lombok.Data;
import java.util.UUID;

@Data
@Entity
@Table(name = "products")
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String name;
    
    @Column(name = "current_price")
    private java.math.BigDecimal currentPrice;
    
    @Transient
    private String status;
}
