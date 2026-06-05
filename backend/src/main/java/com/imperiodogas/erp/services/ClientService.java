package com.imperiodogas.erp.services;

import com.imperiodogas.erp.dto.ClientRequestDTO;
import com.imperiodogas.erp.models.Client;
import com.imperiodogas.erp.models.Person;
import com.imperiodogas.erp.models.PersonType;
import com.imperiodogas.erp.repositories.ClientRepository;
import com.imperiodogas.erp.repositories.PersonRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

    @Transactional
    public Client createFromDto(ClientRequestDTO dto) {
        Client client = new Client();
        
        Person person;
        if (dto.getPersonId() != null) {
            person = personRepository.findById(dto.getPersonId())
                    .orElseThrow(() -> new RuntimeException("Pessoa não encontrada: " + dto.getPersonId()));
        } else {
            if (dto.getName() == null || dto.getName().isBlank()) {
                throw new RuntimeException("Nome da pessoa é obrigatório para criar um cliente.");
            }
            person = new Person();
            person.setName(dto.getName());
            person.setPersonType(dto.getPersonType() != null ? dto.getPersonType() : PersonType.PF);
            person.setDocument(dto.getDocument());
            person.setPhone(dto.getPhone());
            person.setTradeName(dto.getTradeName());
            person = personRepository.save(person);
        }
        
        client.setPerson(person);
        client.setPaymentDeadlineDays(dto.getPaymentDeadlineDays() != null ? dto.getPaymentDeadlineDays() : 0);
        client.setActive(dto.getActive() != null ? dto.getActive() : true);
        
        return repository.save(client);
    }

    @Transactional
    public Client updateFromDto(UUID id, ClientRequestDTO dto) {
        Client client = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cliente não encontrado: " + id));
        
        Person person = client.getPerson();
        if (dto.getName() != null) person.setName(dto.getName());
        if (dto.getPersonType() != null) person.setPersonType(dto.getPersonType());
        if (dto.getDocument() != null) person.setDocument(dto.getDocument());
        if (dto.getPhone() != null) person.setPhone(dto.getPhone());
        if (dto.getTradeName() != null) person.setTradeName(dto.getTradeName());
        personRepository.save(person);

        if (dto.getPaymentDeadlineDays() != null) {
            client.setPaymentDeadlineDays(dto.getPaymentDeadlineDays());
        }
        if (dto.getActive() != null) {
            client.setActive(dto.getActive());
        }
        return repository.save(client);
    }

    @Transactional
    public void delete(UUID id) {
        repository.deleteById(id);
    }
}
