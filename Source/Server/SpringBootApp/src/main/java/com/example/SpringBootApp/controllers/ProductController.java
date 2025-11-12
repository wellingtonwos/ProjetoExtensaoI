package com.example.SpringBootApp.controllers;

import com.example.SpringBootApp.DTOs.ProductCreateDTO;
import com.example.SpringBootApp.models.Product;
import com.example.SpringBootApp.services.CatalogService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.net.URI;

@RestController
@RequestMapping("/products")
@RequiredArgsConstructor
public class ProductController {

    private final CatalogService catalogService;

    @Operation(summary = "Create a new product")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Product created successfully"),
            @ApiResponse(responseCode = "409", description = "Product code already exists"),
            @ApiResponse(responseCode = "404", description = "Category or brand not found"),
            @ApiResponse(responseCode = "400", description = "Invalid input data"),
    })
    @PostMapping
    public ResponseEntity<?> createProduct(@Valid @RequestBody ProductCreateDTO productDTO) {
        Product product = catalogService.createProduct(productDTO);
        return ResponseEntity.created(URI.create("/products/" + product.getId())).build();
    }
}
