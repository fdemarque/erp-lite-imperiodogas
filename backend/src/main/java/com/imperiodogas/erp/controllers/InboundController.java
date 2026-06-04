package com.imperiodogas.erp.controllers;

import com.imperiodogas.erp.dto.ApiResponse;
import com.imperiodogas.erp.models.Inbound;
import com.imperiodogas.erp.services.InboundService;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/inbounds")
public class InboundController {
    private final InboundService service;

    public InboundController(InboundService service) {
        this.service = service;
    }

    @GetMapping
    public ApiResponse<List<Inbound>> getAll() {
        return new ApiResponse<>(true, service.findAll());
    }

    @PostMapping
    public ApiResponse<Inbound> create(@RequestBody Inbound inbound) {
        return new ApiResponse<>(true, service.save(inbound));
    }
}
