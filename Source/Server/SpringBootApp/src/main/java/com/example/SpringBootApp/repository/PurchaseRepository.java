package com.example.SpringBootApp.repository;

import com.example.SpringBootApp.model.Purchase;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PurchaseRepository extends JpaRepository<Purchase, String> {
}
