package com.example.SpringBootApp.DTOs;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class DespesaResponseDTO {
    private Long id;
    private String descricao;
    private String categoria;
    private BigDecimal valor;
    private LocalDateTime dataDespesa;
    private LocalDateTime createdAt;
    private Long createdBy;
}
