package com.example.SpringBootApp.DTOs;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class SaleItemReportDTO {
    private String productName;
    private String brand;
    private BigDecimal quantity;
    private BigDecimal purchasePrice;
    private BigDecimal salePrice;
    private BigDecimal total;
}
