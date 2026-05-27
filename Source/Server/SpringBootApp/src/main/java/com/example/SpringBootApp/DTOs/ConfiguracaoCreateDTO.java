package com.example.SpringBootApp.DTOs;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ConfiguracaoCreateDTO {
    @NotNull(message = "lucroEsperado is required")
    @DecimalMin(value = "0.0", inclusive = true, message = "lucroEsperado must be >= 0")
    private BigDecimal lucroEsperado;

    @NotNull(message = "taxaDebito is required")
    @DecimalMin(value = "0.0", inclusive = true, message = "taxaDebito must be >= 0")
    private BigDecimal taxaDebito;

    @NotNull(message = "taxaCredito is required")
    @DecimalMin(value = "0.0", inclusive = true, message = "taxaCredito must be >= 0")
    private BigDecimal taxaCredito;
}
