package com.example.SpringBootApp.repositories;

import com.example.SpringBootApp.models.Brand;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BrandRepository extends JpaRepository<Brand, Long> {
    
}
