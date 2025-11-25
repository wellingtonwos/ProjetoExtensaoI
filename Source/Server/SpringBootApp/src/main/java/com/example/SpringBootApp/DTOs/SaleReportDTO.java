package com.example.SpringBootApp.DTOs;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class SaleReportDTO {
    private Long id;
    private LocalDateTime timestamp;
    private String paymentMethod;
    private String salesmanName;
    private BigDecimal totalPrice;
    private BigDecimal discounts;
    private List<SaleItemReportDTO> items;

}
