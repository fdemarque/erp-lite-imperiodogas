package com.imperiodogas.erp.repositories;

import com.imperiodogas.erp.models.InboundItem;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface InboundItemRepository extends JpaRepository<InboundItem, UUID> {
}
