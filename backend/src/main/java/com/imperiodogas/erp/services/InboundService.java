package com.imperiodogas.erp.services;

import com.imperiodogas.erp.models.Inbound;
import com.imperiodogas.erp.repositories.InboundRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.UUID;

@Service
public class InboundService {
    private final InboundRepository repository;

    public InboundService(InboundRepository repository) {
        this.repository = repository;
    }

    public List<Inbound> findAll() {
        return repository.findAll();
    }

    public Inbound findById(UUID id) {
        return repository.findById(id).orElse(null);
    }

    public Inbound save(Inbound inbound) {
        return repository.save(inbound);
    }

    public void delete(UUID id) {
        repository.deleteById(id);
    }
}
