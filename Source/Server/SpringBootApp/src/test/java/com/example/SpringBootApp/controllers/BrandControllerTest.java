package com.example.SpringBootApp.controllers;

import com.example.SpringBootApp.DTOs.BrandCreateDTO;
import com.example.SpringBootApp.models.Brand;
import com.example.SpringBootApp.exceptions.ResourceAlreadyExistsException;
import com.example.SpringBootApp.exceptions.GlobalExceptionHandler;
import com.example.SpringBootApp.services.CatalogService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
class BrandControllerTest {

    private MockMvc mockMvc;

    @Mock
    private CatalogService catalogService;

    @InjectMocks
    private BrandController brandController;

    private ObjectMapper objectMapper = new ObjectMapper();

    private void setup() {
        mockMvc = MockMvcBuilders.standaloneSetup(brandController)
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();
    }

    @Test
    void createBrand_ShouldReturn201_WhenValidInput() throws Exception {
        setup();

        // Arrange
        BrandCreateDTO request = new BrandCreateDTO("Nova Marca");
        Brand savedBrand = new Brand(1L, "Nova Marca", null);

        when(catalogService.createBrand(any(BrandCreateDTO.class))).thenReturn(savedBrand);

        // Act & Assert
        mockMvc.perform(post("/brands")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(header().exists("Location"))
                .andExpect(header().string("Location", "/brands/1"));
    }

    @Test
    void createBrand_ShouldReturn409_WhenNameAlreadyExists() throws Exception {
        setup();

        // Arrange
        BrandCreateDTO request = new BrandCreateDTO("Marca Existente");

        when(catalogService.createBrand(any(BrandCreateDTO.class)))
                .thenThrow(new ResourceAlreadyExistsException("Brand name already exists"));

        // Act & Assert
        mockMvc.perform(post("/brands")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.status").value(409))
                .andExpect(jsonPath("$.message").value("Brand name already exists"));
    }

    @Test
    void createBrand_ShouldReturn400_WhenInvalidInput() throws Exception {
        setup();

        // Arrange
        String invalidJson = "{\"name\": \"\"}"; // Nome vazio

        // Act & Assert
        mockMvc.perform(post("/brands")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(invalidJson))
                .andExpect(status().isBadRequest());
    }
}