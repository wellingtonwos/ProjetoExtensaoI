package com.example.SpringBootApp.controllers;

import com.example.SpringBootApp.DTOs.CategoryCreateDTO;
import com.example.SpringBootApp.models.Category;
import com.example.SpringBootApp.services.CatalogService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;

@RestController
@RequestMapping("/categories")
@AllArgsConstructor
public class CategoryController {

    private CatalogService catalogService;

    @Operation(summary = "Create a new category")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Category created successfully"),
            @ApiResponse(responseCode = "409", description = "Category name already exists"),
            @ApiResponse(responseCode = "400", description = "Invalid input data")
    })
    @PostMapping
    public ResponseEntity<?> createCategory(@Valid @RequestBody CategoryCreateDTO categoryDTO) {
        Category category = catalogService.createCategory(categoryDTO);
        return ResponseEntity.created(URI.create("/categories/" + category.getId())).build();
    }
}