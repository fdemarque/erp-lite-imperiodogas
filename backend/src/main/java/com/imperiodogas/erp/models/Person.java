package com.imperiodogas.erp.models;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.Data;
import java.util.UUID;

@Data
@Entity
@Table(name = "people")
public class Person {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "name")
    @JsonProperty("name")
    private String name;
    
    @Column(name = "document")
    @JsonProperty("document")
    private String document;
    
    @Column(name = "phone")
    @JsonProperty("phone")
    private String phone;
    @Column(name = "person_type")
    @JsonProperty("person_type")
    private String type; // e.g. MOTORISTA
}
