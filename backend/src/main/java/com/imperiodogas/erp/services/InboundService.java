package com.imperiodogas.erp.services;

import com.imperiodogas.erp.models.Inbound;
import com.imperiodogas.erp.repositories.InboundRepository;
import com.imperiodogas.erp.models.InboundItem;
import com.imperiodogas.erp.dto.InboundRequestDTO;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.UUID;
import java.math.BigDecimal;
import java.util.ArrayList;

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

    public Inbound createFromDto(InboundRequestDTO dto) {
        Inbound inbound = new Inbound();
        inbound.setInvoiceNumber(dto.getInvoiceNumber());
        inbound.setTruckPlate(dto.getTruckPlate());
        inbound.setStatus("ABERTO");
        
        BigDecimal total = BigDecimal.ZERO;
        List<InboundItem> items = new ArrayList<>();
        
        if (dto.getItems() != null) {
            for (InboundRequestDTO.InboundItemDTO itemDto : dto.getItems()) {
                InboundItem item = new InboundItem();
                item.setInbound(inbound);
                item.setCategory(itemDto.getCategory());
                item.setQuantity(itemDto.getQuantity());
                item.setAvailableQuantity(itemDto.getQuantity());
                item.setUnitCost(itemDto.getUnitCost());
                items.add(item);
                
                if (item.getUnitCost() != null && item.getQuantity() != null) {
                    BigDecimal sub = item.getUnitCost().multiply(new BigDecimal(item.getQuantity()));
                    total = total.add(sub);
                }
            }
        }
        
        inbound.setItems(items);
        inbound.setTotalAmount(total);
        
        return repository.save(inbound);
    }

    public void delete(UUID id) {
        repository.deleteById(id);
    }
}
