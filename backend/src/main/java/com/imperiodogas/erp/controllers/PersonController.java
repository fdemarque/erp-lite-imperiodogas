package com.imperiodogas.erp.controllers;

import com.imperiodogas.erp.dto.ApiResponse;
import com.imperiodogas.erp.dto.PersonRequestDTO;
import com.imperiodogas.erp.models.Person;
import com.imperiodogas.erp.services.PersonService;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/people")
public class PersonController {
    private final PersonService service;

    public PersonController(PersonService service) {
        this.service = service;
    }

    @GetMapping
    public ApiResponse<List<Person>> getAll() {
        return new ApiResponse<>(true, service.findAll());
    }

    @GetMapping("/{id}")
    public ApiResponse<Person> getById(@PathVariable UUID id) {
        return new ApiResponse<>(true, service.findById(id));
    }

    @PostMapping
    public ApiResponse<Person> create(@RequestBody PersonRequestDTO dto) {
        return new ApiResponse<>(true, service.createFromDto(dto));
    }

    @PutMapping("/{id}")
    public ApiResponse<Person> update(@PathVariable UUID id, @RequestBody PersonRequestDTO dto) {
        return new ApiResponse<>(true, service.updateFromDto(id, dto));
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable UUID id) {
        service.delete(id);
    }
}
