package com.imperiodogas.erp.services;

import com.imperiodogas.erp.dto.PersonRequestDTO;
import com.imperiodogas.erp.models.Person;
import com.imperiodogas.erp.repositories.PersonRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.UUID;

@Service
public class PersonService {
    private final PersonRepository repository;

    public PersonService(PersonRepository repository) {
        this.repository = repository;
    }

    public List<Person> findAll() {
        return repository.findAll();
    }

    public Person findById(UUID id) {
        return repository.findById(id).orElse(null);
    }

    public Person createFromDto(PersonRequestDTO dto) {
        if (dto.getName() == null || dto.getName().isBlank()) {
            throw new RuntimeException("name é obrigatório.");
        }
        if (dto.getPersonType() == null) {
            throw new RuntimeException("person_type é obrigatório. Valores válidos: PF, PJ");
        }
        Person person = new Person();
        person.setName(dto.getName());
        person.setPersonType(dto.getPersonType());
        person.setDocument(dto.getDocument());
        person.setPhone(dto.getPhone());
        person.setTradeName(dto.getTradeName());
        return repository.save(person);
    }

    public Person updateFromDto(UUID id, PersonRequestDTO dto) {
        Person person = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pessoa não encontrada: " + id));
        if (dto.getName() != null) person.setName(dto.getName());
        if (dto.getPersonType() != null) person.setPersonType(dto.getPersonType());
        if (dto.getDocument() != null) person.setDocument(dto.getDocument());
        if (dto.getPhone() != null) person.setPhone(dto.getPhone());
        if (dto.getTradeName() != null) person.setTradeName(dto.getTradeName());
        return repository.save(person);
    }

    public void delete(UUID id) {
        repository.deleteById(id);
    }
}
