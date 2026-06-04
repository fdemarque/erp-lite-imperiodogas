package com.imperiodogas.erp.controllers;

import com.imperiodogas.erp.dto.ApiResponse;
import com.imperiodogas.erp.dto.ClientRequestDTO;
import com.imperiodogas.erp.models.Client;
import com.imperiodogas.erp.services.ClientService;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/clients")
public class ClientController {
    private final ClientService service;

    public ClientController(ClientService service) {
        this.service = service;
    }

    @GetMapping
    public ApiResponse<List<Client>> getAll() {
        return new ApiResponse<>(true, service.findAll());
    }

    @GetMapping("/{id}")
    public ApiResponse<Client> getById(@PathVariable UUID id) {
        return new ApiResponse<>(true, service.findById(id));
    }

    @PostMapping
    public ApiResponse<Client> create(@RequestBody ClientRequestDTO dto) {
        return new ApiResponse<>(true, service.createFromDto(dto));
    }

    @PutMapping("/{id}")
    public ApiResponse<Client> update(@PathVariable UUID id, @RequestBody ClientRequestDTO dto) {
        return new ApiResponse<>(true, service.updateFromDto(id, dto));
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable UUID id) {
        service.delete(id);
    }
}
