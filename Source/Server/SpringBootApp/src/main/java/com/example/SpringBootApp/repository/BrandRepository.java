package com.example.SpringBootApp.repository; 

import com.example.SpringBootApp.model.Brand; 
import org.springframework.data.jpa.repository.JpaRepository;

public interface BrandRepository extends JpaRepository<Brand, String> {
    
}
