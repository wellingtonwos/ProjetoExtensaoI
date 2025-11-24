package com.example.SpringBootApp.DTOs;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class PurchaseInStockDTO {

    private LocalDate purchase_date;

    private LocalDate expiring_date;

    private BigDecimal quantity;
}
