package com.imperiodogas.erp.dto;

import lombok.Data;
import java.util.List;
import java.util.UUID;
import com.fasterxml.jackson.annotation.JsonProperty;

@Data
public class InboundRequestDTO {
    @JsonProperty("invoiceNumber")
    private String invoiceNumber;
    
    @JsonProperty("truckPlate")
    private String truckPlate;
    
    @JsonProperty("items")
    private List<InboundItemDTO> items;

    @Data
    public static class InboundItemDTO {
        @JsonProperty("category")
        private com.imperiodogas.erp.models.ProductCategory category;
        
        @JsonProperty("quantity")
        private Integer quantity;
        
        @JsonProperty("unitCost")
        private java.math.BigDecimal unitCost;
    }
}
