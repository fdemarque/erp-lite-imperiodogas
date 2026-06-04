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

    @Column(name = "person_type")
    private String personType;

    private String name;
    private String document;
    private String phone;
    
    @Column(name = "trade_name")
    private String tradeName;
    
    @Column(name = "payment_deadline_days")
    private Integer paymentDeadlineDays;
    
    private Boolean active;

    @ManyToOne
    @JoinColumn(name = "person_id")
    @JsonProperty("people")
    private Person person;

    @Transient
    private Boolean isInadimplente = false;
    
    @Transient
    private Double revenue = 0.0;
    
    @Transient
    private Integer purchasesCount = 0;
}
