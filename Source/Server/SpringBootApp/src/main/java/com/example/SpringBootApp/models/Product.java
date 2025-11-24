package com.example.SpringBootApp.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "produto")
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "nome")
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(name = "unidade_medida")
    private UnitMeasurement unitMeasurement;

    @Column(name = "codigo")
    private Integer code;

    @ManyToOne
    @JoinColumn(name = "fk_categoria_id")
    private Category category;

    @ManyToOne
    @JoinColumn(name = "fk_marca_id")
    private Brand brand;

    @OneToMany(mappedBy = "product", fetch = FetchType.LAZY)
    private List<Item> items;
}