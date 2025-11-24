package com.example.SpringBootApp.DTOs;

import com.example.SpringBootApp.models.PaymentMethod;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.NotEmpty;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SaleCreateDTO {

    private LocalDateTime timestamp;

    @NotNull(message = "Payment method is required")
    private PaymentMethod paymentMethod;

    @PositiveOrZero(message = "Discount must be equal or greater than zero")
    private BigDecimal discount;

    @NotNull(message = "User ID is required")
    private Long userId;

    @NotEmpty(message = "Items list cannot be empty")
    private List<@Valid SaleItemDTO> items;
}