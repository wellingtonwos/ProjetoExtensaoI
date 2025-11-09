package com.example.SpringBootApp.repository;

import com.example.SpringBootApp.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category, String> {
}
