package com.example.SpringBootApp.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

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

    @Column(name = "unidade_medida")
    private String unitMeasurement;

    @Column(name = "codigo")
    private Integer code;

    @ManyToOne
    @JoinColumn(name = "fk_categoria_id")
    private Category category;

    @ManyToOne
    @JoinColumn(name = "fk_marca_id")
    private Brand brand;
}