package com.example.SpringBootApp.controllers;

import com.example.SpringBootApp.DTOs.ProductCreateDTO;
import com.example.SpringBootApp.models.Product;
import com.example.SpringBootApp.services.CatalogService;
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

    @PostMapping
    public ResponseEntity<?> createProduct(@RequestBody @Valid ProductCreateDTO productDTO) {
        Product product = catalogService.createProduct(productDTO);
        return ResponseEntity.created(URI.create("/products/" + product.getId())).build();
    }
}
