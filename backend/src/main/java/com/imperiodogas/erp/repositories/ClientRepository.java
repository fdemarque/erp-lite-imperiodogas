package com.imperiodogas.erp.repositories;

import com.imperiodogas.erp.models.Client;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface ClientRepository extends JpaRepository<Client, UUID> {
}
