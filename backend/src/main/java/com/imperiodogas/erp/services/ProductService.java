package com.imperiodogas.erp.services;

import com.imperiodogas.erp.models.Product;
import com.imperiodogas.erp.repositories.ProductRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.UUID;

@Service
public class ProductService {
    private final ProductRepository repository;

    public ProductService(ProductRepository repository) {
        this.repository = repository;
    }

    public List<Product> findAll() {
        return repository.findAll();
    }

    public Product findById(UUID id) {
        return repository.findById(id).orElse(null);
    }

    public Product save(Product product) {
        return repository.save(product);
    }

    public void delete(UUID id) {
        repository.deleteById(id);
    }
}
