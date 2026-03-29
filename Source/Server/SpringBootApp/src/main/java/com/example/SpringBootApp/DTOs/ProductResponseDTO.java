package com.example.SpringBootApp.DTOs;

import lombok.Data;

@Data
public class ProductResponseDTO {
    private Long id;
    private String name;
    private String code;
    private String brandName;
    private String unitMeasurement;
}