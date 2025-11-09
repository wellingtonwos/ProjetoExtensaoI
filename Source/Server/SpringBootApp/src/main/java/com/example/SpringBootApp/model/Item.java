package com.example.SpringBootApp.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDate;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "item")
public class Item {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "quantidade")
    private Double quantity;

    @Column(name = "preco_unitario_compra")
    private Double purchaseUnitPrice;

    @Column(name = "preco_unitario_venda")
    private Double saleUnitPrice;

    @Column(name = "data_validade")
    private LocalDate expirationDate;

    @ManyToOne
    @JoinColumn(name = "fk_produto_id")
    private Product product;

    @ManyToOne
    @JoinColumn(name = "fk_compra_id")
    private Purchase purchase;

    @ManyToOne
    @JoinColumn(name = "fk_venda_id")
    private Sale sale;
}