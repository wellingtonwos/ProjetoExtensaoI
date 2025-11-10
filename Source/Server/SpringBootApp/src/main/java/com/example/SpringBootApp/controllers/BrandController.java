package com.example.SpringBootApp.controllers;

import com.example.SpringBootApp.DTOs.BrandCreateDTO;
import com.example.SpringBootApp.models.Brand;
import com.example.SpringBootApp.services.CatalogService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;

@RestController
@RequestMapping("/brands")
public class BrandController {

    @Autowired
    private CatalogService catalogService;

    @Operation(summary = "Create a new brand")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Brand created successfully"),
            @ApiResponse(responseCode = "409", description = "Brand name already exists"),
            @ApiResponse(responseCode = "400", description = "Invalid input data")
    })
    @PostMapping
    public ResponseEntity<?> createBrand(@RequestBody BrandCreateDTO brandDTO) {
        Brand brand = catalogService.createBrand(brandDTO);
        return ResponseEntity.created(URI.create("/brands/" + brand.getId())).build();
    }
}