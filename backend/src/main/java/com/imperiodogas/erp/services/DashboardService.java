package com.imperiodogas.erp.services;

import com.imperiodogas.erp.dto.DashboardResponseDTO;
import com.imperiodogas.erp.models.OrderStatus;
import com.imperiodogas.erp.models.SaleType;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DashboardService {
    private final JdbcTemplate jdbcTemplate;

    public DashboardService(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public DashboardResponseDTO getDashboardMetrics() {
        DashboardResponseDTO response = new DashboardResponseDTO();

        // Stock P13
        Integer p13 = jdbcTemplate.queryForObject(
                "SELECT COALESCE(SUM(available_quantity), 0) FROM inbound_items WHERE category = 'GLP_13KG_CHEIO'",
                Integer.class
        );
        response.setP13Stock(p13 != null ? p13 : 0);

        Integer p13Empty = jdbcTemplate.queryForObject(
                "SELECT COALESCE(SUM(available_quantity), 0) FROM inbound_items WHERE category = 'GLP_13KG_VAZIO'",
                Integer.class
        );
        response.setP13Empty(p13Empty != null ? p13Empty : 0);

        // Stock P20
        Integer p20 = jdbcTemplate.queryForObject(
                "SELECT COALESCE(SUM(available_quantity), 0) FROM inbound_items WHERE category = 'GLP_20KG_CHEIO'",
                Integer.class
        );
        response.setP20Stock(p20 != null ? p20 : 0);

        Integer p20Empty = jdbcTemplate.queryForObject(
                "SELECT COALESCE(SUM(available_quantity), 0) FROM inbound_items WHERE category = 'GLP_20KG_VAZIO'",
                Integer.class
        );
        response.setP20Empty(p20Empty != null ? p20Empty : 0);

        // Stock P45
        Integer p45 = jdbcTemplate.queryForObject(
                "SELECT COALESCE(SUM(available_quantity), 0) FROM inbound_items WHERE category = 'GLP_45KG_CHEIO'",
                Integer.class
        );
        response.setP45Stock(p45 != null ? p45 : 0);

        Integer p45Empty = jdbcTemplate.queryForObject(
                "SELECT COALESCE(SUM(available_quantity), 0) FROM inbound_items WHERE category = 'GLP_45KG_VAZIO'",
                Integer.class
        );
        response.setP45Empty(p45Empty != null ? p45Empty : 0);

        // Vendas do Dia (Hoje)
        BigDecimal salesAmount = jdbcTemplate.queryForObject(
                "SELECT COALESCE(SUM(total_amount), 0) FROM orders WHERE DATE(created_at) = CURRENT_DATE AND status = 'FINALIZADO'",
                BigDecimal.class
        );
        response.setTodaySalesAmount(salesAmount);

        Integer salesCount = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM orders WHERE DATE(created_at) = CURRENT_DATE AND status = 'FINALIZADO'",
                Integer.class
        );
        response.setTodaySalesCount(salesCount != null ? salesCount : 0);

        // Inadimplência (Fiado e Pendente)
        Integer overdue = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM orders WHERE sale_type = 'FIADO' AND status = 'PENDENTE'",
                Integer.class
        );
        response.setOverdueInvoices(overdue != null ? overdue : 0);

        // Pedidos por Bairro
        List<DashboardResponseDTO.NeighborhoodMetric> neighborhoods = jdbcTemplate.query(
                "SELECT p.neighborhood, COUNT(o.id) as orders_count " +
                "FROM orders o " +
                "JOIN clients c ON o.client_id = c.id " +
                "JOIN people p ON c.person_id = p.id " +
                "WHERE p.neighborhood IS NOT NULL AND p.neighborhood != '' " +
                "GROUP BY p.neighborhood " +
                "ORDER BY orders_count DESC LIMIT 6",
                (rs, rowNum) -> new DashboardResponseDTO.NeighborhoodMetric(
                        rs.getString("neighborhood"),
                        rs.getLong("orders_count")
                )
        );
        response.setNeighborhoodMetrics(neighborhoods);

        return response;
    }
}
