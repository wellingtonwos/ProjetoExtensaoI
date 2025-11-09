package com.example.SpringBootApp.repositories;

import com.example.SpringBootApp.models.Category;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category, Long> {
}
