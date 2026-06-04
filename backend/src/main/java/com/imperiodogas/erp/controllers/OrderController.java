package com.imperiodogas.erp.controllers;

import com.imperiodogas.erp.dto.ApiResponse;
import com.imperiodogas.erp.models.Order;
import com.imperiodogas.erp.services.OrderService;
import org.springframework.web.bind.annotation.*;
import java.util.List;
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
    public ApiResponse<Order> create(@RequestBody Order order) {
        return new ApiResponse<>(true, service.save(order));
    }

    @PutMapping("/{id}")
    public ApiResponse<Order> update(@PathVariable UUID id, @RequestBody Order order) {
        order.setId(id);
        return new ApiResponse<>(true, service.save(order));
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable UUID id) {
        service.delete(id);
    }
}
