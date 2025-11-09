package com.example.SpringBootApp.repositories;

import com.example.SpringBootApp.models.Purchase;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PurchaseRepository extends JpaRepository<Purchase, Long> {
}
