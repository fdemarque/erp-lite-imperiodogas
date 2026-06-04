package com.imperiodogas.erp.services;

import com.imperiodogas.erp.dto.ClientRequestDTO;
import com.imperiodogas.erp.models.Client;
import com.imperiodogas.erp.repositories.ClientRepository;
import com.imperiodogas.erp.repositories.PersonRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.UUID;

@Service
public class ClientService {
    private final ClientRepository repository;
    private final PersonRepository personRepository;

    public ClientService(ClientRepository repository, PersonRepository personRepository) {
        this.repository = repository;
        this.personRepository = personRepository;
    }

    public List<Client> findAll() {
        return repository.findAll();
    }

    public Client findById(UUID id) {
        return repository.findById(id).orElse(null);
    }

    public Client createFromDto(ClientRequestDTO dto) {
        Client client = new Client();
        if (dto.getPersonId() == null) {
            throw new RuntimeException("person_id é obrigatório para criar um cliente.");
        }
        client.setPerson(personRepository.findById(dto.getPersonId())
                .orElseThrow(() -> new RuntimeException("Pessoa não encontrada: " + dto.getPersonId())));
        if (dto.getPaymentDeadlineDays() != null) {
            client.setPaymentDeadlineDays(dto.getPaymentDeadlineDays());
        }
        if (dto.getActive() != null) {
            client.setActive(dto.getActive());
        } else {
            client.setActive(true); // default do banco
        }
        return repository.save(client);
    }

    public Client updateFromDto(UUID id, ClientRequestDTO dto) {
        Client client = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cliente não encontrado: " + id));
        if (dto.getPersonId() != null) {
            client.setPerson(personRepository.findById(dto.getPersonId())
                    .orElseThrow(() -> new RuntimeException("Pessoa não encontrada: " + dto.getPersonId())));
        }
        if (dto.getPaymentDeadlineDays() != null) {
            client.setPaymentDeadlineDays(dto.getPaymentDeadlineDays());
        }
        if (dto.getActive() != null) {
            client.setActive(dto.getActive());
        }
        return repository.save(client);
    }

    public void delete(UUID id) {
        repository.deleteById(id);
    }
}
