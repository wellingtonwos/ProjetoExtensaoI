package com.example.SpringBootApp.repositories;

import com.example.SpringBootApp.models.Compra;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CompraRepository extends JpaRepository<Compra, Long> {

    @Query("""
        SELECT c FROM Compra c
        WHERE c.id IN (
            SELECT m.compra.id FROM Movimentacao m
            WHERE m.produto.id = :productId
            GROUP BY m.compra.id
            HAVING SUM(m.quantidade) > 0
        )
        ORDER BY c.dataCompra ASC NULLS LAST
        """)
    List<Compra> findComprasWithStockForProduct(@Param("productId") Long productId);
}
