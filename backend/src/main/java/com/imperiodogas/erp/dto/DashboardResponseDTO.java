package com.imperiodogas.erp.dto;

import java.math.BigDecimal;
import java.util.List;

import lombok.Data;

@Data
public class DashboardResponseDTO {
    private Integer p13Stock;
    private Integer p13Empty;
    private Integer p20Stock;
    private Integer p20Empty;
    private Integer p45Stock;
    private Integer p45Empty;
    private BigDecimal todaySalesAmount;
    private Integer todaySalesCount;
    private Integer overdueInvoices;
    private List<NeighborhoodMetric> neighborhoodMetrics;

    @Data
    public static class NeighborhoodMetric {
        private String name;
        private Long orders;

        public NeighborhoodMetric(String name, Long orders) {
            this.name = name;
            this.orders = orders;
        }
    }
}
