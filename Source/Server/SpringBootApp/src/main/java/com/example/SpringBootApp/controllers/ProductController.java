package com.example.SpringBootApp.controllers;

import com.example.SpringBootApp.DTOs.ProductCreateDTO;
import com.example.SpringBootApp.DTOs.ProductWithPurchaseInStockDTO;
import com.example.SpringBootApp.models.Product;
import com.example.SpringBootApp.services.CatalogService;
import com.example.SpringBootApp.services.InventoryService;
import com.example.SpringBootApp.DTOs.ProductResponseDTO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/products")
@RequiredArgsConstructor
public class ProductController {

    private final CatalogService catalogService;
    private final InventoryService inventoryService;

    @Operation(summary = "Create a new product")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Product created successfully"),
            @ApiResponse(responseCode = "409", description = "Product code already exists"),
            @ApiResponse(responseCode = "404", description = "Category or brand not found"),
            @ApiResponse(responseCode = "400", description = "Invalid input data"),
    })

    @PostMapping
    public ResponseEntity<?> createProducts(@Valid @RequestBody ProductCreateDTO productDTO) {
        Product product = catalogService.createProducts(productDTO);
        return ResponseEntity.created(URI.create("/products/" + product.getId())).build();
    }

    @GetMapping("/purchases")
    public ResponseEntity<List<ProductWithPurchaseInStockDTO>> getProductsWithPurchasesInStock() {
        List<ProductWithPurchaseInStockDTO> products = inventoryService.getProductsWithPurchaseInStock();
        return ResponseEntity.ok(products);
    }

		@GetMapping
		public ResponseEntity<List<ProductResponseDTO>> getAllProducts() {
			List<ProductResponseDTO> products = catalogService.getAllProducts();
			return ResponseEntity.ok(products);
		}
}
