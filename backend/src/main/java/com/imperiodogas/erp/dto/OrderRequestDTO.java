package com.imperiodogas.erp.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.imperiodogas.erp.models.SaleType;
import com.imperiodogas.erp.models.OrderStatus;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Data
public class OrderRequestDTO {
    @JsonProperty("clientId")
    private UUID clientId;

    @JsonProperty("driverId")
    private UUID driverId;

    @JsonProperty("deliveryAddressId")
    private UUID deliveryAddressId;

    @JsonProperty("saleType")
    private SaleType saleType;

    @JsonProperty("status")
    private OrderStatus status;

    @JsonProperty("dueDate")
    private LocalDate dueDate;

    @JsonProperty("items")
    private List<OrderItemDTO> items;

    @Data
    public static class OrderItemDTO {
        @JsonProperty("inboundItemId")
        private UUID inboundItemId;

        @JsonProperty("quantity")
        private Integer quantity;

        @JsonProperty("unitPrice")
        private BigDecimal unitPrice;
    }
}
