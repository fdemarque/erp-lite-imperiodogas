package com.imperiodogas.erp.models;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.type.SqlTypes;
import java.time.OffsetDateTime;
import java.util.UUID;

@Data
@Entity
@Table(name = "people")
public class Person {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Enumerated(EnumType.STRING)
    @JdbcTypeCode(SqlTypes.NAMED_ENUM)
    @Column(name = "person_type", columnDefinition = "person_type", nullable = false)
    @JsonProperty("person_type")
    private PersonType personType;

    @Column(name = "name", nullable = false)
    @JsonProperty("name")
    private String name;

    @Column(name = "document")
    @JsonProperty("document")
    private String document;

    @Column(name = "phone")
    @JsonProperty("phone")
    private String phone;

    @Column(name = "trade_name")
    @JsonProperty("trade_name")
    private String tradeName;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    @JsonProperty("created_at")
    private OffsetDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    @JsonProperty("updated_at")
    private OffsetDateTime updatedAt;
}
