package com.example.SpringBootApp.controllers;

import com.example.SpringBootApp.DTOs.ProductCreateDTO;
import com.example.SpringBootApp.models.Product;
import com.example.SpringBootApp.models.UnitMeasurement;
import com.example.SpringBootApp.exceptions.ResourceAlreadyExistsException;
import com.example.SpringBootApp.exceptions.ResourceNotFoundException;
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
class ProductControllerTest {

    private MockMvc mockMvc;

    @Mock
    private CatalogService catalogService;

    @InjectMocks
    private ProductController productController;

    private final ObjectMapper objectMapper = new ObjectMapper();

    private void setup() {
        mockMvc = MockMvcBuilders.standaloneSetup(productController)
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();
    }

    @Test
    void createProduct_ShouldReturn201_WhenValidInput() throws Exception {
        setup();

        // Arrange
        ProductCreateDTO request = new ProductCreateDTO("Picanha", UnitMeasurement.KG, 1001, 1L, 1L);
        Product savedProduct = new Product(1L, "Picanha", UnitMeasurement.KG, 1001, null, null);

        when(catalogService.createProduct(any(ProductCreateDTO.class))).thenReturn(savedProduct);

        // Act & Assert
        mockMvc.perform(post("/products")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(header().exists("Location"))
                .andExpect(header().string("Location", "/products/1"));
    }

    @Test
    void createProduct_ShouldReturn409_WhenCodeAlreadyExists() throws Exception {
        setup();

        // Arrange
        ProductCreateDTO request = new ProductCreateDTO("Picanha", UnitMeasurement.KG, 1001, 1L, 1L);

        when(catalogService.createProduct(any(ProductCreateDTO.class)))
                .thenThrow(new ResourceAlreadyExistsException("Product code already exists"));

        // Act & Assert
        mockMvc.perform(post("/products")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.status").value(409))
                .andExpect(jsonPath("$.message").value("Product code already exists"));
    }

    @Test
    void createProduct_ShouldReturn404_WhenCategoryNotFound() throws Exception {
        setup();

        // Arrange
        ProductCreateDTO request = new ProductCreateDTO("Picanha", UnitMeasurement.KG, 1001, 999L, 1L);

        when(catalogService.createProduct(any(ProductCreateDTO.class)))
                .thenThrow(new ResourceNotFoundException("Category not found"));

        // Act & Assert
        mockMvc.perform(post("/products")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404))
                .andExpect(jsonPath("$.message").value("Category not found"));
    }

    @Test
    void createProduct_ShouldReturn404_WhenBrandNotFound() throws Exception {
        setup();

        // Arrange
        ProductCreateDTO request = new ProductCreateDTO("Picanha", UnitMeasurement.KG, 1001, 1L, 999L);

        when(catalogService.createProduct(any(ProductCreateDTO.class)))
                .thenThrow(new ResourceNotFoundException("Brand not found"));

        // Act & Assert
        mockMvc.perform(post("/products")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404))
                .andExpect(jsonPath("$.message").value("Brand not found"));
    }

    @Test
    void createProduct_ShouldReturn422_WhenInvalidUnitMeasurement() throws Exception {
        setup();

        // Arrange
        String invalidJson = """
        {
            "name": "Picanha",
            "unitMeasurement": null,
            "code": 1001,
            "categoryId": 1,
            "brandId": 1
        }
        """;

        // Act & Assert
        mockMvc.perform(post("/products")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(invalidJson))
                .andExpect(status().isBadRequest());
    }

    @Test
    void createProduct_ShouldReturn400_WhenMissingRequiredFields() throws Exception {
        setup();

        // Arrange
        String invalidJson = "{}"; // Todos campos faltando

        // Act & Assert
        mockMvc.perform(post("/products")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(invalidJson))
                .andExpect(status().isBadRequest());
    }

    @Test
    void createProduct_ShouldReturn400_WhenNameIsBlank() throws Exception {
        setup();

        // Arrange
        String invalidJson = """
        {
            "name": "",
            "unitMeasurement": "KG",
            "code": 1001,
            "categoryId": 1,
            "brandId": 1
        }
        """;

        // Act & Assert
        mockMvc.perform(post("/products")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(invalidJson))
                .andExpect(status().isBadRequest());
    }
}