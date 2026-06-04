package com.imperiodogas.erp.services;

import com.imperiodogas.erp.models.StockMovement;
import com.imperiodogas.erp.repositories.StockMovementRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.UUID;

@Service
public class StockService {
    private final StockMovementRepository repository;

    public StockService(StockMovementRepository repository) {
        this.repository = repository;
    }

    public List<StockMovement> getStockHistory() {
        return repository.findAll(); // Simplified for basic compatibility
    }
}
