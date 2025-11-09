package com.example.SpringBootApp.repositories;

import com.example.SpringBootApp.models.Sale;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SaleRepository extends JpaRepository<Sale, Long> {
}
