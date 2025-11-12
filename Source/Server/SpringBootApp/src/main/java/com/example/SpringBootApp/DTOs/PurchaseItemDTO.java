package com.example.SpringBootApp.DTOs;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PurchaseItemDTO {

    @NotNull(message = "Product ID is required")
    private Long productId;

    @NotNull(message = "Quantity is required")
    @Positive(message = "Quantity must be positive")
    private Double quantity;

    @NotNull(message = "Unit purchase price is required")
    @Positive(message = "Unit purchase price must be positive")
    private Double unitPurchasePrice;

    @NotNull(message = "Unit sale price is required")
    @Positive(message = "Unit sale price must be positive")
    private Double unitSalePrice;

    private LocalDate expiringDate;
}