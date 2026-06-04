package com.imperiodogas.erp.repositories;

import com.imperiodogas.erp.models.Person;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface PersonRepository extends JpaRepository<Person, UUID> {
}
