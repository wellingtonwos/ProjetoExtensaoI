package com.example.SpringBootApp.DTOs;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.NotEmpty;
import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PurchaseCreateDTO {

    @NotNull(message = "Date is required")
    private LocalDate date;

    @NotEmpty(message = "Items list cannot be empty")
    private List<@Valid PurchaseItemDTO> items;
}