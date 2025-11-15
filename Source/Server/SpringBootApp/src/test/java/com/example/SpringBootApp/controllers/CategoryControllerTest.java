package com.example.SpringBootApp.controllers;

import com.example.SpringBootApp.DTOs.CategoryCreateDTO;
import com.example.SpringBootApp.models.Category;
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
class CategoryControllerTest {

    private MockMvc mockMvc;

    @Mock
    private CatalogService catalogService;

    @InjectMocks
    private CategoryController categoryController;

    private final ObjectMapper objectMapper = new ObjectMapper();

    private void setup() {
        mockMvc = MockMvcBuilders.standaloneSetup(categoryController)
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();
    }

    @Test
    void createCategory_ShouldReturn201_WhenValidInput() throws Exception {
        setup();

        // Arrange
        CategoryCreateDTO request = new CategoryCreateDTO("Nova Categoria");
        Category savedCategory = new Category(1L, "Nova Categoria", null);

        when(catalogService.createCategory(any(CategoryCreateDTO.class))).thenReturn(savedCategory);

        // Act & Assert
        mockMvc.perform(post("/categories")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(header().exists("Location"))
                .andExpect(header().string("Location", "/categories/1"));
    }

    @Test
    void createCategory_ShouldReturn409_WhenNameAlreadyExists() throws Exception {
        setup();

        // Arrange
        CategoryCreateDTO request = new CategoryCreateDTO("Categoria Existente");

        when(catalogService.createCategory(any(CategoryCreateDTO.class)))
                .thenThrow(new ResourceAlreadyExistsException("Category name already exists"));

        // Act & Assert
        mockMvc.perform(post("/categories")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.status").value(409))
                .andExpect(jsonPath("$.message").value("Category name already exists"));
    }

    @Test
    void createCategory_ShouldReturn400_WhenNameIsBlank() throws Exception {
        setup();

        // Arrange
        String invalidJson = "{\"name\": \"\"}"; // Nome vazio

        // Act & Assert
        mockMvc.perform(post("/categories")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(invalidJson))
                .andExpect(status().isBadRequest());
    }

    @Test
    void createCategory_ShouldReturn400_WhenNameIsNull() throws Exception {
        setup();

        // Arrange
        String invalidJson = "{}"; // Name é null

        // Act & Assert
        mockMvc.perform(post("/categories")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(invalidJson))
                .andExpect(status().isBadRequest());
    }
}