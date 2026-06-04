package com.imperiodogas.erp.models;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.type.SqlTypes;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.UUID;

@Data
@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "person_id", nullable = false)
    @JsonProperty("person")
    private Person person;

    @Column(name = "email", length = 255)
    @JsonProperty("email")
    private String email;

    @Enumerated(EnumType.STRING)
    @JdbcTypeCode(SqlTypes.NAMED_ENUM)
    @Column(name = "role", columnDefinition = "user_role", nullable = false)
    @JsonProperty("role")
    private UserRole role;

    @Column(name = "monthly_salary", precision = 10, scale = 2)
    @JsonProperty("monthly_salary")
    private BigDecimal monthlySalary;

    @Column(name = "birth_date")
    @JsonProperty("birth_date")
    private LocalDate birthDate;

    @Column(name = "hire_date")
    @JsonProperty("hire_date")
    private LocalDate hireDate;

    @Column(name = "address")
    @JsonProperty("address")
    private String address;

    @Column(name = "cpf", length = 14)
    @JsonProperty("cpf")
    private String cpf;

    @Column(name = "active", nullable = false)
    @JsonProperty("active")
    private boolean active = true;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    @JsonProperty("created_at")
    private OffsetDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    @JsonProperty("updated_at")
    private OffsetDateTime updatedAt;
}
