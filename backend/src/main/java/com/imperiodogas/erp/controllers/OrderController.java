package com.imperiodogas.erp.controllers;

import com.imperiodogas.erp.dto.ApiResponse;
import com.imperiodogas.erp.dto.OrderRequestDTO;
import com.imperiodogas.erp.models.Order;
import com.imperiodogas.erp.models.OrderStatus;
import com.imperiodogas.erp.services.OrderService;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/orders")
public class OrderController {
    private final OrderService service;

    public OrderController(OrderService service) {
        this.service = service;
    }

    @GetMapping
    public ApiResponse<List<Order>> getAll() {
        return new ApiResponse<>(true, service.findAll());
    }

    @GetMapping("/{id}")
    public ApiResponse<Order> getById(@PathVariable UUID id) {
        return new ApiResponse<>(true, service.findById(id));
    }

    @PostMapping
    public ApiResponse<Order> create(@RequestBody OrderRequestDTO dto) {
        return new ApiResponse<>(true, service.createFromDto(dto));
    }

    /**
     * Atualiza metadados de um pedido (ex.: status).
     * Aceita um body parcial: { "status": "ENTREGUE" | "CANCELADO" }
     */
    @PatchMapping("/{id}/status")
    public ApiResponse<Order> updateStatus(
            @PathVariable UUID id,
            @RequestBody Map<String, String> body) {
        Order order = service.findById(id);
        if (order == null) throw new RuntimeException("Pedido não encontrado: " + id);
        String statusStr = body.get("status");
        if (statusStr != null) {
            order.setStatus(OrderStatus.valueOf(statusStr));
        }
        return new ApiResponse<>(true, service.save(order));
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable UUID id) {
        service.delete(id);
    }
}
