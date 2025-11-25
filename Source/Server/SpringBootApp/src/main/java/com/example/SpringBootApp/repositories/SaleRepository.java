package com.example.SpringBootApp.repositories;

import com.example.SpringBootApp.models.Product;
import com.example.SpringBootApp.models.Sale;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface SaleRepository extends JpaRepository<Sale, Long> {

    @Query("""
        SELECT DISTINCT s FROM Sale s
        LEFT JOIN FETCH s.items saleItem
        LEFT JOIN FETCH saleItem.purchase purchase
        LEFT JOIN FETCH saleItem.product p
        LEFT JOIN FETCH p.brand
        LEFT JOIN FETCH s.user
        WHERE s.timestamp BETWEEN :startDate AND :endDate
        ORDER BY s.timestamp DESC
        """)
    List<Sale> findByTimestampBetweenWithItems(@Param("startDate") LocalDateTime startDate,
                                               @Param("endDate") LocalDateTime endDate);
}
