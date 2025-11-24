package com.example.SpringBootApp.controllers;

import com.example.SpringBootApp.DTOs.SaleCreateDTO;
import com.example.SpringBootApp.models.Sale;
import com.example.SpringBootApp.services.SalesService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;

@RestController
@RequestMapping("/sales")
@RequiredArgsConstructor
public class SaleController {

    private final SalesService salesService;

    @Operation(summary = "Create a new sale")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Sale created successfully"),
            @ApiResponse(responseCode = "404", description = "User or purchase item not found"),
            @ApiResponse(responseCode = "400", description = "Invalid input data"),
            @ApiResponse(responseCode = "422", description = "Insufficient quantity")
    })
    @PostMapping
    public ResponseEntity<?> createSale(@Valid @RequestBody SaleCreateDTO saleDTO) {
        Sale sale = salesService.createSale(saleDTO);
        return ResponseEntity.created(URI.create("/sales/" + sale.getId())).build();
    }
}