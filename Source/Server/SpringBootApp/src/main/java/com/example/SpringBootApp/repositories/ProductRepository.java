package com.example.SpringBootApp.repositories;

import com.example.SpringBootApp.models.Product;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<Product, Long> {
}
