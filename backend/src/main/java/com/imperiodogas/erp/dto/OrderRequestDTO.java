package com.imperiodogas.erp.dto;

import lombok.Data;
import java.util.List;
import java.util.UUID;
import com.fasterxml.jackson.annotation.JsonProperty;

@Data
public class OrderRequestDTO {
    @JsonProperty("clientId")
    private UUID clientId;
    
    @JsonProperty("driverId")
    private UUID driverId;
    
    @JsonProperty("saleType")
    private String saleType;
    
    @JsonProperty("status")
    private String status;
    
    @JsonProperty("items")
    private List<OrderItemDTO> items;

    @Data
    public static class OrderItemDTO {
        @JsonProperty("inboundItemId")
        private UUID inboundItemId;
        
        @JsonProperty("quantity")
        private Integer quantity;
        
        @JsonProperty("unitPrice")
        private java.math.BigDecimal unitPrice;
    }
}
