package com.example.SpringBootApp.repositories;

import com.example.SpringBootApp.models.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
}
