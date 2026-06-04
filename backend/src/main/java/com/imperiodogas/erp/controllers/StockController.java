package com.imperiodogas.erp.controllers;

import com.imperiodogas.erp.dto.ApiResponse;
import com.imperiodogas.erp.models.StockMovement;
import com.imperiodogas.erp.services.StockService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/stock")
public class StockController {
    private final StockService service;

    public StockController(StockService service) {
        this.service = service;
    }

    @GetMapping("/history")
    public ApiResponse<List<StockMovement>> getHistory() {
        return new ApiResponse<>(true, service.getStockHistory());
    }
    
    // Stub for getCurrent if needed. The frontend calls /stock/current.
    @GetMapping("/current")
    public ApiResponse<List<Object>> getCurrent() {
        // Return empty list as a stub. It requires a specific logic to calculate current stock.
        return new ApiResponse<>(true, List.of());
    }
}
