package com.example.SpringBootApp.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "venda")
public class Sale {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "data")
    private LocalDateTime timestamp         ;

    @Enumerated(EnumType.STRING)
    @Column(name = "metodo_pagamento")
    private PaymentMethod paymentMethod;

    @Column(name = "desconto")
    private BigDecimal discount;

    @ManyToOne
    @JoinColumn(name = "fk_usuario_id")
    private User user;

    @OneToMany(mappedBy = "sale", fetch = FetchType.LAZY)
    private List<Item> items;
}