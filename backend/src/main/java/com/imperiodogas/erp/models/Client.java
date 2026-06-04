package com.imperiodogas.erp.models;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.Data;
import java.util.UUID;

@Data
@Entity
@Table(name = "clients")
public class Client {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Transient
    @JsonProperty("person_type")
    private String personType;

    @Transient
    @JsonProperty("name")
    private String name;
    
    @Transient
    @JsonProperty("document")
    private String document;
    
    @Transient
    @JsonProperty("phone")
    private String phone;
    
    @Transient
    @JsonProperty("trade_name")
    private String tradeName;
    
    @Column(name = "payment_deadline_days")
    @JsonProperty("payment_deadline_days")
    private Integer paymentDeadlineDays;
    
    @Column(name = "active")
    @JsonProperty("active")
    private Boolean active;

    @ManyToOne
    @JoinColumn(name = "person_id")
    @JsonProperty("people")
    private Person person;

    @Transient
    @JsonProperty("is_inadimplente")
    private Boolean isInadimplente = false;
    
    @Transient
    @JsonProperty("revenue")
    private Double revenue = 0.0;
    
    @Transient
    @JsonProperty("purchases_count")
    private Integer purchasesCount = 0;
}
