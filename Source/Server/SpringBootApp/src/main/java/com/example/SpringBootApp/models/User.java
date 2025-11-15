package com.example.SpringBootApp.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "usuario")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "nome")
    private String name;

    @Column(name = "senha")
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(name = "nivel_acesso")
    private AccessLevel accessLevel;

    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
    private List<Sale> sales;
}