package com.imperiodogas.erp.controllers;

import com.imperiodogas.erp.dto.ApiResponse;
import com.imperiodogas.erp.models.Product;
import com.imperiodogas.erp.services.ProductService;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/products")
public class ProductController {
    private final ProductService service;

    public ProductController(ProductService service) {
        this.service = service;
    }

    @GetMapping
    public ApiResponse<List<Product>> getAll() {
        return new ApiResponse<>(true, service.findAll());
    }

    @GetMapping("/{id}")
    public ApiResponse<Product> getById(@PathVariable UUID id) {
        return new ApiResponse<>(true, service.findById(id));
    }

    @PostMapping
    public ApiResponse<Product> create(@RequestBody Product product) {
        return new ApiResponse<>(true, service.save(product));
    }

    @PutMapping("/{id}")
    public ApiResponse<Product> update(@PathVariable UUID id, @RequestBody Product product) {
        product.setId(id);
        return new ApiResponse<>(true, service.save(product));
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable UUID id) {
        service.delete(id);
    }
}
