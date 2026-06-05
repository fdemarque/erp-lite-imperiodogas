package com.imperiodogas.erp.services;

import com.imperiodogas.erp.models.Order;
import com.imperiodogas.erp.models.OrderItem;
import com.imperiodogas.erp.models.OrderStatus;
import com.imperiodogas.erp.models.InboundItem;
import com.imperiodogas.erp.repositories.OrderRepository;
import com.imperiodogas.erp.repositories.InboundItemRepository;
import com.imperiodogas.erp.repositories.ClientRepository;
import com.imperiodogas.erp.dto.OrderRequestDTO;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.UUID;
import java.util.ArrayList;
import java.math.BigDecimal;

@Service
public class OrderService {
    private final OrderRepository repository;
    private final InboundItemRepository inboundItemRepository;
    private final ClientRepository clientRepository;

    public OrderService(OrderRepository repository, InboundItemRepository inboundItemRepository,
                        ClientRepository clientRepository) {
        this.repository = repository;
        this.inboundItemRepository = inboundItemRepository;
        this.clientRepository = clientRepository;
    }

    public List<Order> findAll() {
        return repository.findAll();
    }

    public Order findById(UUID id) {
        return repository.findById(id).orElse(null);
    }

    @Transactional
    public Order createFromDto(OrderRequestDTO dto) {
        Order order = new Order();

        if (dto.getClientId() != null) {
            order.setClient(clientRepository.findById(dto.getClientId())
                    .orElseThrow(() -> new RuntimeException("Cliente não encontrado: " + dto.getClientId())));
        }

        if (dto.getDriverId() != null) {
            order.setDeliveryDriverId(dto.getDriverId());
        }
        if (dto.getDeliveryAddressId() != null) {
            order.setDeliveryAddressId(dto.getDeliveryAddressId());
        }

        // sale_type é NOT NULL (ENUM sale_type: AVISTA | FIADO | CARTAO)
        if (dto.getSaleType() == null) {
            throw new RuntimeException("saleType é obrigatório. Valores válidos: AVISTA, FIADO, CARTAO");
        }
        order.setSaleType(dto.getSaleType());

        // status padrão = ABERTO (order_status ENUM: ABERTO | ENTREGUE | CANCELADO)
        order.setStatus(dto.getStatus() == null ? OrderStatus.ABERTO : dto.getStatus());

        if (dto.getDueDate() != null) {
            order.setDueDate(dto.getDueDate());
        }

        BigDecimal total = BigDecimal.ZERO;
        List<OrderItem> items = new ArrayList<>();

        if (dto.getItems() != null) {
            for (OrderRequestDTO.OrderItemDTO itemDto : dto.getItems()) {
                InboundItem inboundItem = inboundItemRepository.findById(itemDto.getInboundItemId())
                        .orElseThrow(() -> new RuntimeException("InboundItem não encontrado: " + itemDto.getInboundItemId()));

                if (inboundItem.getAvailableQuantity() < itemDto.getQuantity()) {
                    throw new RuntimeException("Quantidade insuficiente em estoque para o lote selecionado.");
                }

                inboundItem.setAvailableQuantity(inboundItem.getAvailableQuantity() - itemDto.getQuantity());
                inboundItemRepository.save(inboundItem);

                OrderItem item = new OrderItem();
                item.setOrder(order);
                item.setInboundItem(inboundItem);
                item.setQuantity(itemDto.getQuantity());
                item.setUnitPrice(itemDto.getUnitPrice());
                items.add(item);

                if (item.getUnitPrice() != null && item.getQuantity() != null) {
                    BigDecimal sub = item.getUnitPrice().multiply(new BigDecimal(item.getQuantity()));
                    total = total.add(sub);
                }
            }
        }

        order.setItems(items);
        order.setTotalAmount(total);

        return repository.save(order);
    }

    public Order save(Order order) {
        return repository.save(order);
    }

    public void delete(UUID id) {
        repository.deleteById(id);
    }
}
