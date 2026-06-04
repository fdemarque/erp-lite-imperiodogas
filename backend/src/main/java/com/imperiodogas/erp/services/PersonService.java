package com.imperiodogas.erp.services;

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

    public Person save(Person person) {
        return repository.save(person);
    }

    public void delete(UUID id) {
        repository.deleteById(id);
    }
}
