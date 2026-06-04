package com.imperiodogas.erp.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.imperiodogas.erp.models.PersonType;
import lombok.Data;

/**
 * DTO para criação/atualização de uma Person.
 * person_type aceita: PF | PJ
 */
@Data
public class PersonRequestDTO {
    @JsonProperty("name")
    private String name;

    @JsonProperty("document")
    private String document;

    @JsonProperty("phone")
    private String phone;

    @JsonProperty("trade_name")
    private String tradeName;

    @JsonProperty("person_type")
    private PersonType personType;
}
