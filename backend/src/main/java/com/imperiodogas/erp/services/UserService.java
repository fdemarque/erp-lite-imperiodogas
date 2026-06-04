package com.imperiodogas.erp.services;

import com.imperiodogas.erp.dto.UserRequestDTO;
import com.imperiodogas.erp.models.*;
import com.imperiodogas.erp.repositories.PersonRepository;
import com.imperiodogas.erp.repositories.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final PersonRepository personRepository;

    public UserService(UserRepository userRepository, PersonRepository personRepository) {
        this.userRepository = userRepository;
        this.personRepository = personRepository;
    }

    public List<User> findAll() {
        return userRepository.findAll();
    }

    public List<User> findByRole(UserRole role) {
        return userRepository.findByRole(role);
    }

    public List<User> findDeliverers() {
        return userRepository.findByRoleAndActiveTrue(UserRole.ENTREGADOR);
    }

    public User findById(UUID id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado: " + id));
    }

    @Transactional
    public User createFromDto(UserRequestDTO dto) {
        if (dto.getName() == null || dto.getName().isBlank()) {
            throw new RuntimeException("name é obrigatório.");
        }
        if (dto.getRole() == null) {
            throw new RuntimeException("role é obrigatório. Valores válidos: ADMINISTRADOR, SECRETARIO, ENTREGADOR");
        }
        if (dto.getBirthDate() == null) {
            throw new RuntimeException("birth_date é obrigatório.");
        }
        if (dto.getCpf() == null || dto.getCpf().isBlank()) {
            throw new RuntimeException("cpf é obrigatório.");
        }

        // Cria a Person associada (tipo PF)
        Person person = new Person();
        person.setName(dto.getName());
        person.setPersonType(PersonType.PF);
        person.setDocument(dto.getCpf());
        person.setPhone(dto.getPhone());
        Person savedPerson = personRepository.save(person);

        // Cria o User
        User user = new User();
        user.setPerson(savedPerson);
        user.setRole(dto.getRole());
        user.setCpf(dto.getCpf());
        user.setAddress(dto.getAddress());
        user.setMonthlySalary(dto.getMonthlySalary());
        user.setBirthDate(dto.getBirthDate());
        user.setHireDate(dto.getHireDate());
        user.setActive(dto.getActive() != null ? dto.getActive() : true);

        return userRepository.save(user);
    }

    @Transactional
    public User updateFromDto(UUID id, UserRequestDTO dto) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado: " + id));

        // Atualiza pessoa associada
        Person person = user.getPerson();
        if (dto.getName() != null) person.setName(dto.getName());
        if (dto.getPhone() != null) person.setPhone(dto.getPhone());
        if (dto.getCpf() != null) {
            person.setDocument(dto.getCpf());
            user.setCpf(dto.getCpf());
        }
        personRepository.save(person);

        // Atualiza user
        if (dto.getRole() != null) user.setRole(dto.getRole());
        if (dto.getAddress() != null) user.setAddress(dto.getAddress());
        if (dto.getMonthlySalary() != null) user.setMonthlySalary(dto.getMonthlySalary());
        if (dto.getBirthDate() != null) user.setBirthDate(dto.getBirthDate());
        if (dto.getHireDate() != null) user.setHireDate(dto.getHireDate());
        if (dto.getActive() != null) user.setActive(dto.getActive());

        return userRepository.save(user);
    }

    @Transactional
    public void delete(UUID id) {
        userRepository.deleteById(id);
    }
}
