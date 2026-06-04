package com.imperiodogas.erp.services;

import com.imperiodogas.erp.models.Order;
import com.imperiodogas.erp.repositories.OrderRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.UUID;

@Service
public class OrderService {
    private final OrderRepository repository;

    public OrderService(OrderRepository repository) {
        this.repository = repository;
    }

    public List<Order> findAll() {
        return repository.findAll();
    }

    public Order findById(UUID id) {
        return repository.findById(id).orElse(null);
    }

    public Order save(Order order) {
        return repository.save(order);
    }

    public void delete(UUID id) {
        repository.deleteById(id);
    }
}
