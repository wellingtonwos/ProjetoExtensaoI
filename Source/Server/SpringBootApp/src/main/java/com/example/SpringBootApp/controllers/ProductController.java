package com.example.SpringBootApp.controllers;

import com.example.SpringBootApp.DTOs.ProductCreateDTO;
import com.example.SpringBootApp.models.Product;
import com.example.SpringBootApp.services.CatalogService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.net.URI;

@RestController
@RequestMapping("/products")
public class ProductController {
    @Autowired
    private CatalogService catalogService;

    @Operation(summary = "Create a new product")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Product created successfully"),
            @ApiResponse(responseCode = "409", description = "Product code already exists"),
            @ApiResponse(responseCode = "404", description = "Category or brand not found"),
            @ApiResponse(responseCode = "400", description = "Invalid input data"),
            @ApiResponse(responseCode = "422", description = "Business rule violation")
    })
    @PostMapping
    public ResponseEntity<?> createProduct(@RequestBody @Valid ProductCreateDTO productDTO) {
        Product product = catalogService.createProduct(productDTO);
        return ResponseEntity.created(URI.create("/products/" + product.getId())).build();
    }
}
