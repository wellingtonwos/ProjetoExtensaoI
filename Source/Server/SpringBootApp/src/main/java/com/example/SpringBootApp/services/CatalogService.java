package com.example.SpringBootApp.services;

import com.example.SpringBootApp.DTOs.*;
import com.example.SpringBootApp.exceptions.ResourceAlreadyExistsException;
import com.example.SpringBootApp.exceptions.ResourceNotFoundException;
import com.example.SpringBootApp.models.Brand;
import com.example.SpringBootApp.models.Category;
import com.example.SpringBootApp.models.Product;
import com.example.SpringBootApp.repositories.BrandRepository;
import com.example.SpringBootApp.repositories.CategoryRepository;
import com.example.SpringBootApp.repositories.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class CatalogService {

	private final ProductRepository productRepository;

	private final CategoryRepository categoryRepository;

	private final BrandRepository brandRepository;

	public Product createProducts(ProductCreateDTO productDTO) {
		Category category = categoryRepository.findById(productDTO.getCategoryId())
				.orElseThrow(() -> new ResourceNotFoundException("Category not found"));

		Brand brand = brandRepository.findById(productDTO.getBrandId())
				.orElseThrow(() -> new ResourceNotFoundException("Brand not found"));

		if (productRepository.existsByCode(productDTO.getCode())) {
			throw new ResourceAlreadyExistsException("Product code already exists");
		}

		Product product = new Product();
		product.setName(productDTO.getName());
		product.setUnitMeasurement(productDTO.getUnitMeasurement());
		product.setCode(productDTO.getCode());
		product.setCategory(category);
		product.setBrand(brand);

		return productRepository.save(product);
	}

	public Category createCategory(CategoryCreateDTO categoryDTO) {
		if (categoryRepository.existsByName(categoryDTO.getName())) {
			throw new ResourceAlreadyExistsException("Category name already exists");
		}

		Category category = new Category();
		category.setName(categoryDTO.getName());

		return categoryRepository.save(category);
	}

	public Brand createBrand(BrandCreateDTO brandDTO) {
		if (brandRepository.existsByName(brandDTO.getName())) {
			throw new ResourceAlreadyExistsException("Brand name already exists");
		}

		Brand brand = new Brand();
		brand.setName(brandDTO.getName());

		return brandRepository.save(brand);
	}

	public List<BrandDTO> getAllBrands() {
		List<Brand> brands = brandRepository.findAll();
		List<BrandDTO> brandsDTO = new ArrayList<>();

		for (Brand brand : brands) {
			BrandDTO currentBrand = new BrandDTO();
			currentBrand.setId(brand.getId());
			currentBrand.setBrandName(brand.getName());
			brandsDTO.add(currentBrand);
		}
		return brandsDTO;
	}

	public List<CategoryDTO> getAllCategories() {
		List<Category> categories = categoryRepository.findAll();
		List<CategoryDTO> categoriesDTO = new ArrayList<>();

		for (Category category : categories) {
			CategoryDTO currentCategory = new CategoryDTO();
			currentCategory.setId(category.getId());
			currentCategory.setCategoryName(category.getName());
			categoriesDTO.add(currentCategory);
		}
		return categoriesDTO;
	}

	public List<ProductResponseDTO> getAllProducts() {
		List<Product> products = productRepository.findAll();

		return products.stream().map(product -> {
			ProductResponseDTO dto = new ProductResponseDTO();
			dto.setId(product.getId());
			dto.setName(product.getName());
			dto.setCode(product.getCode());
			dto.setUnitMeasurement(product.getUnitMeasurement() != null ? product.getUnitMeasurement().name() : null); // Se
			return dto;
		}).collect(Collectors.toList());
	}
}