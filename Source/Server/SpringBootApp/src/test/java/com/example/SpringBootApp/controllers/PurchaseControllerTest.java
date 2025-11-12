package com.example.SpringBootApp.controllers;

import com.example.SpringBootApp.DTOs.PurchaseCreateDTO;
import com.example.SpringBootApp.DTOs.PurchaseItemDTO;
import com.example.SpringBootApp.models.Purchase;
import com.example.SpringBootApp.services.InventoryService;
import com.example.SpringBootApp.exceptions.ResourceNotFoundException;
import com.example.SpringBootApp.exceptions.GlobalExceptionHandler;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.time.LocalDate;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
class PurchaseControllerTest {

    private MockMvc mockMvc;

    @Mock
    private InventoryService inventoryService;

    @InjectMocks
    private PurchaseController purchaseController;

    private ObjectMapper objectMapper;

    @BeforeEach
    void setup() {
        objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule()); // Para serializar LocalDate

        mockMvc = MockMvcBuilders.standaloneSetup(purchaseController)
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();
    }

    @Test
    void createPurchase_ShouldReturn201_WhenValidInput() throws Exception {
        // Arrange
        PurchaseItemDTO item1 = new PurchaseItemDTO(1L, 10.5, 45.90, 69.90, LocalDate.of(2024, 2, 15));
        PurchaseItemDTO item2 = new PurchaseItemDTO(2L, 5.0, 32.50, 49.90, LocalDate.of(2024, 3, 1));
        PurchaseCreateDTO request = new PurchaseCreateDTO(LocalDate.of(2024, 1, 15), List.of(item1, item2));

        Purchase savedPurchase = new Purchase(1L, LocalDate.of(2024, 1, 15), null);

        when(inventoryService.createPurchase(any(PurchaseCreateDTO.class))).thenReturn(savedPurchase);

        // Act & Assert
        mockMvc.perform(post("/purchases")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(header().exists("Location"))
                .andExpect(header().string("Location", "/purchases/1"));
    }

    @Test
    void createPurchase_ShouldReturn404_WhenProductNotFound() throws Exception {
        // Arrange
        PurchaseItemDTO item = new PurchaseItemDTO(999L, 10.5, 45.90, 69.90, null);
        PurchaseCreateDTO request = new PurchaseCreateDTO(LocalDate.now(), List.of(item));

        when(inventoryService.createPurchase(any(PurchaseCreateDTO.class)))
                .thenThrow(new ResourceNotFoundException("Product not found with id: 999"));

        // Act & Assert
        mockMvc.perform(post("/purchases")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404))
                .andExpect(jsonPath("$.message").value("Product not found with id: 999"));
    }

    @Test
    void createPurchase_ShouldReturn400_WhenEmptyItemsList() throws Exception {
        // Arrange
        String invalidJson = """
        {
            "date": "2024-01-15",
            "items": []
        }
        """;

        // Act & Assert
        mockMvc.perform(post("/purchases")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(invalidJson))
                .andExpect(status().isBadRequest());
    }

    @Test
    void createPurchase_ShouldReturn400_WhenMissingRequiredFields() throws Exception {
        // Arrange
        String invalidJson = """
        {
            "date": "2024-01-15",
            "items": [
                {
                    "quantity": 10.5,
                    "unitPurchasePrice": 45.90
                }
            ]
        }
        """;

        // Act & Assert
        mockMvc.perform(post("/purchases")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(invalidJson))
                .andExpect(status().isBadRequest());
    }

    @Test
    void createPurchase_ShouldReturn400_WhenNegativePrice() throws Exception {
        // Arrange
        String invalidJson = """
        {
            "date": "2024-01-15",
            "items": [
                {
                    "productId": 1,
                    "quantity": 10.5,
                    "unitPurchasePrice": -45.90,
                    "unitSalePrice": 69.90
                }
            ]
        }
        """;

        // Act & Assert
        mockMvc.perform(post("/purchases")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(invalidJson))
                .andExpect(status().isBadRequest());
    }
}