package com.imperiodogas.erp.repositories;

import com.imperiodogas.erp.models.User;
import com.imperiodogas.erp.models.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID> {
    List<User> findByRole(UserRole role);
    List<User> findByActiveTrue();
    List<User> findByRoleAndActiveTrue(UserRole role);
}
