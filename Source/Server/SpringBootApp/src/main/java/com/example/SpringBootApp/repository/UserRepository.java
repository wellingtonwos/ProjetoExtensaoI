package com.example.SpringBootApp.repository;

import com.example.SpringBootApp.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, String> {
}
