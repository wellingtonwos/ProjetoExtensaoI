package com.example.SpringBootApp.services;

import com.example.SpringBootApp.DTOs.ProductCreateDTO;
import com.example.SpringBootApp.exceptions.BusinessException;
import com.example.SpringBootApp.exceptions.ResourceNotFoundException;
import com.example.SpringBootApp.models.Brand;
import com.example.SpringBootApp.models.Category;
import com.example.SpringBootApp.models.Product;
import com.example.SpringBootApp.repositories.BrandRepository;
import com.example.SpringBootApp.repositories.CategoryRepository;
import com.example.SpringBootApp.repositories.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class CatalogService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private BrandRepository brandRepository;

    public Product createProduct(ProductCreateDTO productDTO) {
        Category category = categoryRepository.findById(productDTO.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));

        Brand brand = brandRepository.findById(productDTO.getBrandId())
                .orElseThrow(() -> new ResourceNotFoundException("Brand not found"));

        if (productRepository.existsByCode(productDTO.getCode())) {
            throw new BusinessException("Product code already exists");
        }

        if (!productDTO.getUnitMeasurement().equals("KG") && !productDTO.getUnitMeasurement().equals("UN")) {
            throw new BusinessException("Unit measurement must be KG or UN");
        }

        Product product = new Product();
        product.setName(productDTO.getName());
        product.setUnitMeasurement(productDTO.getUnitMeasurement());
        product.setCode(productDTO.getCode());
        product.setCategory(category);
        product.setBrand(brand);

        return productRepository.save(product);
    }
}