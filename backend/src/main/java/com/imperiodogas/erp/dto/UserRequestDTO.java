package com.imperiodogas.erp.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.imperiodogas.erp.models.UserRole;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * DTO para criação/atualização de um User.
 * role aceita: ADMINISTRADOR | SECRETARIO | ENTREGADOR
 */
@Data
public class UserRequestDTO {

    // Dados da Pessoa (criada junto)
    @JsonProperty("name")
    private String name;

    @JsonProperty("phone")
    private String phone;

    // Dados do Usuário
    @JsonProperty("role")
    private UserRole role;

    @JsonProperty("cpf")
    private String cpf;

    @JsonProperty("address")
    private String address;

    @JsonProperty("monthly_salary")
    private BigDecimal monthlySalary;

    @JsonProperty("birth_date")
    private LocalDate birthDate;

    @JsonProperty("hire_date")
    private LocalDate hireDate;

    @JsonProperty("active")
    private Boolean active;
}
