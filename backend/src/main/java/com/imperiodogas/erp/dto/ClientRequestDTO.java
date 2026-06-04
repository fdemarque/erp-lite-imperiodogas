package com.imperiodogas.erp.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import java.util.UUID;

/**
 * DTO para criação/atualização de um Client.
 * O banco exige apenas person_id (FK para people) + campos opcionais.
 */
@Data
public class ClientRequestDTO {
    @JsonProperty("person_id")
    private UUID personId;

    @JsonProperty("payment_deadline_days")
    private Integer paymentDeadlineDays;

    @JsonProperty("active")
    private Boolean active;
}
