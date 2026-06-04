package com.imperiodogas.erp.services;

import com.imperiodogas.erp.models.Client;
import com.imperiodogas.erp.repositories.ClientRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.UUID;

@Service
public class ClientService {
    private final ClientRepository repository;

    public ClientService(ClientRepository repository) {
        this.repository = repository;
    }

    public List<Client> findAll() {
        return repository.findAll();
    }

    public Client findById(UUID id) {
        return repository.findById(id).orElse(null);
    }

    public Client save(Client client) {
        return repository.save(client);
    }

    public void delete(UUID id) {
        repository.deleteById(id);
    }
}
