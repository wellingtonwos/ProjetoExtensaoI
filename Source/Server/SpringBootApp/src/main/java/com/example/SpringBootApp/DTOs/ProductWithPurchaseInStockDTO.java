package com.example.SpringBootApp.DTOs;

import com.example.SpringBootApp.models.UnitMeasurement;
import lombok.Data;

import java.util.List;

@Data
public class ProductWithPurchaseInStockDTO {

    private Integer id;

    private String product_name;

    private String brand_name;

    private UnitMeasurement unitMeasurement;

    private List<PurchaseInStockDTO> purchases;

}
