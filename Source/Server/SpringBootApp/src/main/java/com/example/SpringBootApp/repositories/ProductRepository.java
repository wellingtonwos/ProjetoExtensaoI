package com.example.SpringBootApp.repositories;

import com.example.SpringBootApp.models.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    boolean existsByCode(Integer code);

    @Query("""
        SELECT DISTINCT p FROM Product p
        LEFT JOIN FETCH p.items
        """)
    List<Product> findAllWithItems();
}
