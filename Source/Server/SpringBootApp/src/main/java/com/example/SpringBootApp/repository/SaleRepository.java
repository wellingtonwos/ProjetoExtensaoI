package com.example.SpringBootApp.repository;

import com.example.SpringBootApp.model.Sale;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SaleRepository extends JpaRepository<Sale, String> {
}
