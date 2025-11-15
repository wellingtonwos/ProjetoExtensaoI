package com.example.SpringBootApp.controllers;

import com.example.SpringBootApp.DTOs.PurchaseCreateDTO;
import com.example.SpringBootApp.models.Purchase;
import com.example.SpringBootApp.services.InventoryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;

@RestController
@RequestMapping("/purchases")
@RequiredArgsConstructor
public class PurchaseController {

    private final InventoryService inventoryService;

    @Operation(summary = "Create a new purchase")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Purchase created successfully"),
            @ApiResponse(responseCode = "404", description = "Product not found"),
            @ApiResponse(responseCode = "400", description = "Invalid input data")
    })
    @PostMapping
    public ResponseEntity<?> createPurchase(@Valid @RequestBody PurchaseCreateDTO purchaseDTO) {
        Purchase purchase = inventoryService.createPurchase(purchaseDTO);
        return ResponseEntity.created(URI.create("/purchases/" + purchase.getId())).build();
    }
}