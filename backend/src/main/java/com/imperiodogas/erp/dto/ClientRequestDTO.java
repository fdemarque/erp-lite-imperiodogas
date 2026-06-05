package com.imperiodogas.erp.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.imperiodogas.erp.models.PersonType;
import lombok.Data;
import java.util.UUID;

/**
 * DTO para criação/atualização de um Client.
 * O banco exige person_id (FK para people) + campos opcionais, mas também suporta
 * criação simultânea da Person passando seus dados.
 */
@Data
public class ClientRequestDTO {
    // Campos da Pessoa
    @JsonProperty("person_type")
    private PersonType personType;

    @JsonProperty("name")
    private String name;

    @JsonProperty("document")
    private String document;

    @JsonProperty("phone")
    private String phone;

    @JsonProperty("trade_name")
    private String tradeName;

    // Campos do Cliente
    @JsonProperty("person_id")
    private UUID personId;

    @JsonProperty("payment_deadline_days")
    private Integer paymentDeadlineDays;

    @JsonProperty("active")
    private Boolean active;
}
