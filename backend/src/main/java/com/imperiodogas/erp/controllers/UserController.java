package com.imperiodogas.erp.controllers;

import com.imperiodogas.erp.dto.ApiResponse;
import com.imperiodogas.erp.dto.UserRequestDTO;
import com.imperiodogas.erp.models.User;
import com.imperiodogas.erp.models.UserRole;
import com.imperiodogas.erp.services.UserService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserService service;

    public UserController(UserService service) {
        this.service = service;
    }

    @GetMapping
    public ApiResponse<List<User>> getAll() {
        return new ApiResponse<>(true, service.findAll());
    }

    @GetMapping("/entregadores")
    public ApiResponse<List<User>> getDeliverers() {
        return new ApiResponse<>(true, service.findDeliverers());
    }

    @GetMapping("/role/{role}")
    public ApiResponse<List<User>> getByRole(@PathVariable UserRole role) {
        return new ApiResponse<>(true, service.findByRole(role));
    }

    @GetMapping("/{id}")
    public ApiResponse<User> getById(@PathVariable UUID id) {
        return new ApiResponse<>(true, service.findById(id));
    }

    @PostMapping
    public ApiResponse<User> create(@RequestBody UserRequestDTO dto) {
        return new ApiResponse<>(true, service.createFromDto(dto));
    }

    @PutMapping("/{id}")
    public ApiResponse<User> update(@PathVariable UUID id, @RequestBody UserRequestDTO dto) {
        return new ApiResponse<>(true, service.updateFromDto(id, dto));
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable UUID id) {
        service.delete(id);
    }
}
