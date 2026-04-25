package com.example.SpringBootApp.services;

import com.example.SpringBootApp.DTOs.*;
import com.example.SpringBootApp.exceptions.ResourceAlreadyExistsException;
import com.example.SpringBootApp.exceptions.ResourceNotFoundException;
import com.example.SpringBootApp.exceptions.BusinessException;
import com.example.SpringBootApp.models.Marca;
import com.example.SpringBootApp.models.Categoria;
import com.example.SpringBootApp.models.Produto;
import com.example.SpringBootApp.repositories.MarcaRepository;
import com.example.SpringBootApp.repositories.CategoriaRepository;
import com.example.SpringBootApp.repositories.ProdutoRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class CatalogoService {

	private final ProdutoRepository ProdutoRepository;

	private final CategoriaRepository CategoriaRepository;

	private final MarcaRepository MarcaRepository;

	public Produto createProducts(ProdutoCreateDTO productDTO) {
		Categoria Categoria = CategoriaRepository.findById(productDTO.getCategoryId())
				.orElseThrow(() -> new ResourceNotFoundException("Category not found"));

		Marca Marca = MarcaRepository.findById(productDTO.getBrandId())
				.orElseThrow(() -> new ResourceNotFoundException("Brand not found"));

		if (ProdutoRepository.existsByCodigo(productDTO.getCode())) {
			throw new ResourceAlreadyExistsException("Product code already exists");
		}

		Produto Produto = new Produto();
		Produto.setNome(productDTO.getName());
		Produto.setUnidadeMedida(productDTO.getUnitMeasurement());
		Produto.setCodigo(productDTO.getCode());
		Produto.setCategoria(Categoria);
		Produto.setMarca(Marca);

		return ProdutoRepository.save(Produto);
	}

	public Categoria createCategory(CategoriaCreateDTO CategoriaDTO) {
		String normalized = normalize(CategoriaDTO.getName());
		List<Categoria> existing = CategoriaRepository.findAll();
		for (Categoria c : existing) {
			if (normalize(c.getNome()).equals(normalized)) {
				throw new ResourceAlreadyExistsException("Category name already exists");
			}
		}

		Categoria Categoria = new Categoria();
		Categoria.setNome(CategoriaDTO.getName());

		return CategoriaRepository.save(Categoria);
	}

	public Marca createBrand(MarcaCreateDTO MarcaDTO) {
		String normalized = normalize(MarcaDTO.getName());
		List<Marca> existing = MarcaRepository.findAll();
		for (Marca m : existing) {
			if (normalize(m.getNome()).equals(normalized)) {
				throw new ResourceAlreadyExistsException("Brand name already exists");
			}
		}

		Marca Marca = new Marca();
		Marca.setNome(MarcaDTO.getName());

		return MarcaRepository.save(Marca);
	}

	public List<MarcaDTO> getAllBrands() {
		List<Marca> brands = MarcaRepository.findAll();
		List<MarcaDTO> brandsDTO = new ArrayList<>();

		for (Marca marca : brands) {
			MarcaDTO currentBrand = new MarcaDTO();
			currentBrand.setId(marca.getId());
			currentBrand.setBrandName(marca.getNome());
			brandsDTO.add(currentBrand);
		}
		return brandsDTO;
	}

	public List<CategoriaDTO> getAllCategories() {
		List<Categoria> categories = CategoriaRepository.findAll();
		List<CategoriaDTO> categoriesDTO = new ArrayList<>();

		for (Categoria categoria : categories) {
			CategoriaDTO currentCategory = new CategoriaDTO();
			currentCategory.setId(categoria.getId());
			currentCategory.setCategoryName(categoria.getNome());
			categoriesDTO.add(currentCategory);
		}
		return categoriesDTO;
	}

	public List<ProdutoResponseDTO> getAllProducts() {
		List<Produto> products = ProdutoRepository.findAll();

		return products.stream().map(Produto -> {
			ProdutoResponseDTO dto = new ProdutoResponseDTO();
			dto.setId(Produto.getId());
			dto.setName(Produto.getNome());
			dto.setCode(Produto.getCodigo());
			dto.setBrandName(Produto.getMarca().getNome());
			dto.setUnitMeasurement(Produto.getUnidadeMedida() != null ? Produto.getUnidadeMedida().name() : null);
			return dto;
		}).collect(Collectors.toList());
	}

	public Page<ProdutoQuantidadeEstoqueDTO> searchProductsWithStock(String query, int page) {
		String termo = (query == null) ? "" : query.trim();
		Pageable pageable = PageRequest.of(page, 10, Sort.by("nome").ascending());

		if (termo.length() < 2) {
			return Page.empty(pageable);
		}

		return ProdutoRepository.searchProductsWithStock(termo, pageable);
	}

	public Categoria updateCategory(Long id, CategoriaCreateDTO CategoriaDTO) {
		Categoria categoria = CategoriaRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Category not found"));

		String normalized = normalize(CategoriaDTO.getName());
		List<Categoria> existing = CategoriaRepository.findAll();
		for (Categoria c : existing) {
			if (!c.getId().equals(id) && normalize(c.getNome()).equals(normalized)) {
				throw new ResourceAlreadyExistsException("Category name already exists");
			}
		}

		categoria.setNome(CategoriaDTO.getName());
		return CategoriaRepository.save(categoria);
	}

	public Marca updateBrand(Long id, MarcaCreateDTO MarcaDTO) {
		Marca marca = MarcaRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Brand not found"));

		String normalized = normalize(MarcaDTO.getName());
		List<Marca> existing = MarcaRepository.findAll();
		for (Marca m : existing) {
			if (!m.getId().equals(id) && normalize(m.getNome()).equals(normalized)) {
				throw new ResourceAlreadyExistsException("Brand name already exists");
			}
		}

		marca.setNome(MarcaDTO.getName());
		return MarcaRepository.save(marca);
	}

	public void deleteCategory(Long id) {
		Categoria categoria = CategoriaRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Category not found"));

		boolean used = ProdutoRepository.findAll().stream().anyMatch(p ->
				p.getCategoria() != null && p.getCategoria().getId().equals(id));
		if (used) {
			throw new BusinessException("Category is linked to products and cannot be deleted");
		}

		CategoriaRepository.delete(categoria);
	}

	public void deleteBrand(Long id) {
		Marca marca = MarcaRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Brand not found"));

		boolean used = ProdutoRepository.findAll().stream().anyMatch(p ->
				p.getMarca() != null && p.getMarca().getId().equals(id));
		if (used) {
			throw new BusinessException("Brand is linked to products and cannot be deleted");
		}

		MarcaRepository.delete(marca);
	}

	private String normalize(String input) {
		if (input == null) return "";
		String normalized = java.text.Normalizer.normalize(input, java.text.Normalizer.Form.NFD);
		normalized = normalized.replaceAll("\\p{M}", "");
		return normalized.toLowerCase().trim();
	}
}



