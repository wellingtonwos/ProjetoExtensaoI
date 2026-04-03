package com.example.SpringBootApp.repositories;

import com.example.SpringBootApp.models.Produto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProdutoRepository extends JpaRepository<Produto, Long> {
    boolean existsByCodigo(String codigo);

    @Query("""
        SELECT DISTINCT p FROM Produto p
        LEFT JOIN FETCH p.itens
        """)
    List<Produto> findAllWithItems();
}

