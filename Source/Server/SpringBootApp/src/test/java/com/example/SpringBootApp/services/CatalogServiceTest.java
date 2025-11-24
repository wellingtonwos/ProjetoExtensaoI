package com.example.SpringBootApp.services;

import com.example.SpringBootApp.DTOs.BrandCreateDTO;
import com.example.SpringBootApp.DTOs.CategoryCreateDTO;
import com.example.SpringBootApp.DTOs.ProductCreateDTO;
import com.example.SpringBootApp.exceptions.ResourceAlreadyExistsException;
import com.example.SpringBootApp.exceptions.ResourceNotFoundException;
import com.example.SpringBootApp.models.Brand;
import com.example.SpringBootApp.models.Category;
import com.example.SpringBootApp.models.Product;
import com.example.SpringBootApp.models.UnitMeasurement;
import com.example.SpringBootApp.repositories.BrandRepository;
import com.example.SpringBootApp.repositories.CategoryRepository;
import com.example.SpringBootApp.repositories.ProductRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CatalogServiceTest {

    @Mock
    private ProductRepository productRepository;

    @Mock
    private CategoryRepository categoryRepository;

    @Mock
    private BrandRepository brandRepository;

    @InjectMocks
    private CatalogService catalogService;

    @Test
    void createProduct_ShouldReturnProduct_WhenValidInput() {
        // Arrange
        ProductCreateDTO productDTO = new ProductCreateDTO("Picanha", UnitMeasurement.KG, 1001, 1L, 1L);
        Category category = new Category(1L, "Bovino", null);
        Brand brand = new Brand(1L, "Friboi", null);
        Product expectedProduct = new Product(1L, "Picanha", UnitMeasurement.KG, 1001, category, brand, null);

        when(categoryRepository.findById(1L)).thenReturn(Optional.of(category));
        when(brandRepository.findById(1L)).thenReturn(Optional.of(brand));
        when(productRepository.existsByCode(1001)).thenReturn(false);
        when(productRepository.save(any(Product.class))).thenReturn(expectedProduct);

        // Act
        Product result = catalogService.createProducts(productDTO);

        // Assert
        assertNotNull(result);
        assertEquals("Picanha", result.getName());
        assertEquals(UnitMeasurement.KG, result.getUnitMeasurement());
        assertEquals(1001, result.getCode());
        assertEquals(category, result.getCategory());
        assertEquals(brand, result.getBrand());

        verify(categoryRepository).findById(1L);
        verify(brandRepository).findById(1L);
        verify(productRepository).existsByCode(1001);
        verify(productRepository).save(any(Product.class));
    }

    @Test
    void createProduct_ShouldThrowException_WhenCategoryNotFound() {
        // Arrange
        ProductCreateDTO productDTO = new ProductCreateDTO("Picanha", UnitMeasurement.KG, 1001, 999L, 1L);

        when(categoryRepository.findById(999L)).thenReturn(Optional.empty());

        // Act & Assert
        ResourceNotFoundException exception = assertThrows(ResourceNotFoundException.class,
                () -> catalogService.createProducts(productDTO));

        assertEquals("Category not found", exception.getMessage());
        verify(categoryRepository).findById(999L);
        verify(brandRepository, never()).findById(any());
        verify(productRepository, never()).existsByCode(any());
        verify(productRepository, never()).save(any());
    }

    @Test
    void createProduct_ShouldThrowException_WhenBrandNotFound() {
        // Arrange
        ProductCreateDTO productDTO = new ProductCreateDTO("Picanha", UnitMeasurement.KG, 1001, 1L, 999L);
        Category category = new Category(1L, "Bovino", null);

        when(categoryRepository.findById(1L)).thenReturn(Optional.of(category));
        when(brandRepository.findById(999L)).thenReturn(Optional.empty());

        // Act & Assert
        ResourceNotFoundException exception = assertThrows(ResourceNotFoundException.class,
                () -> catalogService.createProducts(productDTO));

        assertEquals("Brand not found", exception.getMessage());
        verify(categoryRepository).findById(1L);
        verify(brandRepository).findById(999L);
        verify(productRepository, never()).existsByCode(any());
        verify(productRepository, never()).save(any());
    }

    @Test
    void createProduct_ShouldThrowException_WhenCodeAlreadyExists() {
        // Arrange
        ProductCreateDTO productDTO = new ProductCreateDTO("Picanha", UnitMeasurement.KG, 1001, 1L, 1L);
        Category category = new Category(1L, "Bovino", null);
        Brand brand = new Brand(1L, "Friboi", null);

        when(categoryRepository.findById(1L)).thenReturn(Optional.of(category));
        when(brandRepository.findById(1L)).thenReturn(Optional.of(brand));
        when(productRepository.existsByCode(1001)).thenReturn(true);

        // Act & Assert
        ResourceAlreadyExistsException exception = assertThrows(ResourceAlreadyExistsException.class,
                () -> catalogService.createProducts(productDTO));

        assertEquals("Product code already exists", exception.getMessage());
        verify(categoryRepository).findById(1L);
        verify(brandRepository).findById(1L);
        verify(productRepository).existsByCode(1001);
        verify(productRepository, never()).save(any());
    }

    @Test
    void createCategory_ShouldReturnCategory_WhenValidInput() {
        // Arrange
        CategoryCreateDTO categoryDTO = new CategoryCreateDTO("Suíno");
        Category expectedCategory = new Category(1L, "Suíno", null);

        when(categoryRepository.existsByName("Suíno")).thenReturn(false);
        when(categoryRepository.save(any(Category.class))).thenReturn(expectedCategory);

        // Act
        Category result = catalogService.createCategory(categoryDTO);

        // Assert
        assertNotNull(result);
        assertEquals("Suíno", result.getName());

        verify(categoryRepository).existsByName("Suíno");
        verify(categoryRepository).save(any(Category.class));
    }

    @Test
    void createCategory_ShouldThrowException_WhenNameAlreadyExists() {
        // Arrange
        CategoryCreateDTO categoryDTO = new CategoryCreateDTO("Bovino");

        when(categoryRepository.existsByName("Bovino")).thenReturn(true);

        // Act & Assert
        ResourceAlreadyExistsException exception = assertThrows(ResourceAlreadyExistsException.class,
                () -> catalogService.createCategory(categoryDTO));

        assertEquals("Category name already exists", exception.getMessage());
        verify(categoryRepository).existsByName("Bovino");
        verify(categoryRepository, never()).save(any());
    }

    @Test
    void createBrand_ShouldReturnBrand_WhenValidInput() {
        // Arrange
        BrandCreateDTO brandDTO = new BrandCreateDTO("Sadia");
        Brand expectedBrand = new Brand(1L, "Sadia", null);

        when(brandRepository.existsByName("Sadia")).thenReturn(false);
        when(brandRepository.save(any(Brand.class))).thenReturn(expectedBrand);

        // Act
        Brand result = catalogService.createBrand(brandDTO);

        // Assert
        assertNotNull(result);
        assertEquals("Sadia", result.getName());

        verify(brandRepository).existsByName("Sadia");
        verify(brandRepository).save(any(Brand.class));
    }

    @Test
    void createBrand_ShouldThrowException_WhenNameAlreadyExists() {
        // Arrange
        BrandCreateDTO brandDTO = new BrandCreateDTO("Friboi");

        when(brandRepository.existsByName("Friboi")).thenReturn(true);

        // Act & Assert
        ResourceAlreadyExistsException exception = assertThrows(ResourceAlreadyExistsException.class,
                () -> catalogService.createBrand(brandDTO));

        assertEquals("Brand name already exists", exception.getMessage());
        verify(brandRepository).existsByName("Friboi");
        verify(brandRepository, never()).save(any());
    }
}