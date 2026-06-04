package com.imperiodogas.erp.repositories;

import com.imperiodogas.erp.models.Inbound;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface InboundRepository extends JpaRepository<Inbound, UUID> {
}
