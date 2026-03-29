package com.example.SpringBootApp.services;

import com.example.SpringBootApp.DTOs.PurchaseCreateDTO;
import com.example.SpringBootApp.DTOs.PurchaseItemDTO;
import com.example.SpringBootApp.exceptions.ResourceNotFoundException;
import com.example.SpringBootApp.models.*;
import com.example.SpringBootApp.repositories.PurchaseRepository;
import com.example.SpringBootApp.repositories.ItemRepository;
import com.example.SpringBootApp.repositories.ProductRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class InventoryServiceTest {

    @Mock
    private PurchaseRepository purchaseRepository;

    @Mock
    private ItemRepository itemRepository;

    @Mock
    private ProductRepository productRepository;

    @InjectMocks
    private InventoryService inventoryService;

    @Test
    void createPurchase_ShouldReturnPurchase_WhenValidInput() {
        // Arrange
        PurchaseItemDTO item1 = new PurchaseItemDTO(1L, new BigDecimal("10.5"), new BigDecimal("45.90"), new BigDecimal("69.90"), LocalDate.of(2024, 2, 15));
        PurchaseItemDTO item2 = new PurchaseItemDTO(2L, new BigDecimal("5.0"), new BigDecimal("32.50"), new BigDecimal("49.90"), LocalDate.of(2024, 3, 1));
        PurchaseCreateDTO purchaseDTO = new PurchaseCreateDTO(LocalDate.of(2024, 1, 15), List.of(item1, item2));

        Product product1 = new Product();
        product1.setId(1L);
        product1.setName("Picanha");
        product1.setUnitMeasurement(UnitMeasurement.KG);
        product1.setCode("000001");
        
        Product product2 = new Product();
        product2.setId(2L);
        product2.setName("Alcatra");
        product2.setUnitMeasurement(UnitMeasurement.KG);
        product2.setCode("000002");

        Purchase savedPurchase = new Purchase();
        savedPurchase.setId(1L);
        savedPurchase.setPurchaseDate(LocalDate.of(2024, 1, 15));
        
        Item savedItem1 = new Item();
        savedItem1.setId(1L);
        savedItem1.setQuantity(new BigDecimal("10.5"));
        savedItem1.setPurchaseUnitPrice(new BigDecimal("45.90"));
        savedItem1.setSaleUnitPrice(new BigDecimal("69.90"));
        savedItem1.setExpirationDate(LocalDate.of(2024, 2, 15));
        savedItem1.setProduct(product1);
        savedItem1.setPurchase(savedPurchase);
        savedItem1.setMovementType(MovementType.COMPRA);
        
        Item savedItem2 = new Item();
        savedItem2.setId(2L);
        savedItem2.setQuantity(new BigDecimal("5.0"));
        savedItem2.setPurchaseUnitPrice(new BigDecimal("32.50"));
        savedItem2.setSaleUnitPrice(new BigDecimal("49.90"));
        savedItem2.setExpirationDate(LocalDate.of(2024, 3, 1));
        savedItem2.setProduct(product2);
        savedItem2.setPurchase(savedPurchase);
        savedItem2.setMovementType(MovementType.COMPRA);

        when(purchaseRepository.save(any(Purchase.class))).thenReturn(savedPurchase);
        when(productRepository.findById(1L)).thenReturn(Optional.of(product1));
        when(productRepository.findById(2L)).thenReturn(Optional.of(product2));
        when(itemRepository.save(any(Item.class))).thenReturn(savedItem1, savedItem2);

        // Act
        Purchase result = inventoryService.createPurchase(purchaseDTO);

        // Assert
        assertNotNull(result);
        assertEquals(LocalDate.of(2024, 1, 15), result.getPurchaseDate());
        assertEquals(1L, result.getId());

        verify(purchaseRepository).save(any(Purchase.class));
        verify(productRepository, times(2)).findById(1L);
        verify(productRepository, times(2)).findById(2L);
        verify(itemRepository, times(2)).save(any(Item.class));
    }

    @Test
    void createPurchase_ShouldUseCurrentDate_WhenDateIsNull() {
        // Arrange
        PurchaseItemDTO item = new PurchaseItemDTO(1L, new BigDecimal("10.5"), new BigDecimal("45.90"), new BigDecimal("69.90"), null);
        PurchaseCreateDTO purchaseDTO = new PurchaseCreateDTO(null, List.of(item));

        Product product = new Product();
        product.setId(1L);
        product.setName("Picanha");
        product.setUnitMeasurement(UnitMeasurement.KG);
        product.setCode("000001");
        
        Purchase savedPurchase = new Purchase();
        savedPurchase.setId(1L);
        savedPurchase.setPurchaseDate(LocalDate.now());
        
        Item savedItem = new Item();
        savedItem.setId(1L);
        savedItem.setQuantity(new BigDecimal("10.5"));
        savedItem.setPurchaseUnitPrice(new BigDecimal("45.90"));
        savedItem.setSaleUnitPrice(new BigDecimal("69.90"));
        savedItem.setProduct(product);
        savedItem.setPurchase(savedPurchase);
        savedItem.setMovementType(MovementType.COMPRA);

        when(purchaseRepository.save(any(Purchase.class))).thenReturn(savedPurchase);
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));
        when(itemRepository.save(any(Item.class))).thenReturn(savedItem);

        // Act
        Purchase result = inventoryService.createPurchase(purchaseDTO);

        // Assert
        assertNotNull(result);
        assertEquals(LocalDate.now(), result.getPurchaseDate());
    }

    @Test
    void createPurchase_ShouldThrowException_WhenProductNotFound() {
        // Arrange
        PurchaseItemDTO item = new PurchaseItemDTO(999L, new BigDecimal("10.5"), new BigDecimal("45.90"), new BigDecimal("69.90"), null);
        PurchaseCreateDTO purchaseDTO = new PurchaseCreateDTO(LocalDate.now(), List.of(item));

        when(productRepository.findById(999L)).thenReturn(Optional.empty());

        // Act & Assert
        ResourceNotFoundException exception = assertThrows(ResourceNotFoundException.class,
                () -> inventoryService.createPurchase(purchaseDTO));

        assertEquals("Product not found with id: 999", exception.getMessage());
        verify(productRepository).findById(999L);
        verify(purchaseRepository, never()).save(any());
        verify(itemRepository, never()).save(any());
    }

    @Test
    void createPurchase_ShouldCreateItemsWithCorrectData() {
        // Arrange
        LocalDate expiringDate = LocalDate.of(2024, 2, 15);
        PurchaseItemDTO itemDTO = new PurchaseItemDTO(1L, new BigDecimal("10.5"), new BigDecimal("45.90"), new BigDecimal("69.90"), expiringDate);
        PurchaseCreateDTO purchaseDTO = new PurchaseCreateDTO(LocalDate.now(), List.of(itemDTO));

        Product product = new Product();
        product.setId(1L);
        product.setName("Picanha");
        product.setUnitMeasurement(UnitMeasurement.KG);
        product.setCode("000001");
        
        Purchase savedPurchase = new Purchase();
        savedPurchase.setId(1L);
        savedPurchase.setPurchaseDate(LocalDate.now());

        when(purchaseRepository.save(any(Purchase.class))).thenReturn(savedPurchase);
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));

        // Mock para capturar o Item salvo
        when(itemRepository.save(any(Item.class))).thenAnswer(invocation -> {
            Item item = invocation.getArgument(0);
            assertEquals(new BigDecimal("10.5"), item.getQuantity());
            assertEquals(new BigDecimal("45.90"), item.getPurchaseUnitPrice());
            assertEquals(new BigDecimal("69.90"), item.getSaleUnitPrice());
            assertEquals(expiringDate, item.getExpirationDate());
            assertEquals(product, item.getProduct());
            assertEquals(savedPurchase, item.getPurchase());
            assertNull(item.getSale());
            assertEquals(MovementType.COMPRA, item.getMovementType());
            
            Item returnItem = new Item();
            returnItem.setId(1L);
            returnItem.setQuantity(item.getQuantity());
            returnItem.setPurchaseUnitPrice(item.getPurchaseUnitPrice());
            returnItem.setSaleUnitPrice(item.getSaleUnitPrice());
            returnItem.setExpirationDate(item.getExpirationDate());
            returnItem.setProduct(item.getProduct());
            returnItem.setPurchase(item.getPurchase());
            returnItem.setMovementType(item.getMovementType());
            return returnItem;
        });

        // Act
        Purchase result = inventoryService.createPurchase(purchaseDTO);

        // Assert
        assertNotNull(result);
        verify(itemRepository).save(any(Item.class));
    }
}


