package com.imperiodogas.erp;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import jakarta.annotation.PostConstruct;

@Component
public class DatabaseUpdater {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @PostConstruct
    public void updateDatabase() {
        try {
            jdbcTemplate.execute("ALTER TABLE orders ALTER COLUMN client_id DROP NOT NULL;");
            System.out.println("client_id constraint updated.");
        } catch (Exception e) {
            System.out.println("Failed to alter client_id: " + e.getMessage());
        }

        try {
            jdbcTemplate.execute("ALTER TYPE sale_type ADD VALUE 'CARTAO';");
            System.out.println("sale_type enum updated.");
        } catch (Exception e) {
            System.out.println("Failed to alter sale_type enum: " + e.getMessage());
        }
    }
}
