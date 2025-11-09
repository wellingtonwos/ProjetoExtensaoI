package com.example.SpringBootApp.repository;

import com.example.SpringBootApp.model.Item;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ItemRepository extends JpaRepository<Item, String> {
}
