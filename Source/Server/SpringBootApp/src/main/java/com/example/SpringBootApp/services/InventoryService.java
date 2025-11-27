package com.example.SpringBootApp.services;

import com.example.SpringBootApp.DTOs.ProductWithPurchaseInStockDTO;
import com.example.SpringBootApp.DTOs.PurchaseCreateDTO;
import com.example.SpringBootApp.DTOs.PurchaseInStockDTO;
import com.example.SpringBootApp.DTOs.PurchaseItemDTO;
import com.example.SpringBootApp.exceptions.ResourceNotFoundException;
import com.example.SpringBootApp.models.*;
import com.example.SpringBootApp.repositories.PurchaseRepository;
import com.example.SpringBootApp.repositories.ItemRepository;
import com.example.SpringBootApp.repositories.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class InventoryService {

    private final PurchaseRepository purchaseRepository;
    private final ItemRepository itemRepository;
    private final ProductRepository productRepository;

    public Purchase createPurchase(PurchaseCreateDTO purchaseDTO) {
        for (PurchaseItemDTO itemDTO : purchaseDTO.getItems()) {
            productRepository.findById(itemDTO.getProductId())
                    .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + itemDTO.getProductId()));
        }

        Purchase purchase = new Purchase();
        purchase.setDate(purchaseDTO.getDate() != null ? purchaseDTO.getDate() : LocalDate.now());

        Purchase savedPurchase = purchaseRepository.save(purchase);

        List<Item> items = new ArrayList<>();
        for (PurchaseItemDTO itemDTO : purchaseDTO.getItems()) {
            Product product = productRepository.findById(itemDTO.getProductId()).get();

            Item item = new Item();
            item.setQuantity(itemDTO.getQuantity());
            item.setPurchaseUnitPrice(itemDTO.getUnitPurchasePrice());
            item.setSaleUnitPrice(itemDTO.getUnitSalePrice());
            item.setExpirationDate(itemDTO.getExpiringDate());
            item.setProduct(product);
            item.setPurchase(savedPurchase);
            item.setSale(null);

            items.add(itemRepository.save(item));
        }

        savedPurchase.setItems(items);
        return savedPurchase;
    }

    public List<ProductWithPurchaseInStockDTO> getProductsWithPurchaseInStock(){
        List<Product> products = productRepository.findAllWithItems()
                .stream()
                .filter(product -> !product.getItems().isEmpty())
                .toList();
        return products.stream()
                .map(product -> {

                    ProductWithPurchaseInStockDTO dto = new ProductWithPurchaseInStockDTO();

                    dto.setId(product.getId().intValue());
                    dto.setCode(product.getCode());
                    dto.setProduct_name(product.getName());
                    dto.setBrand_name(product.getBrand() != null ? product.getBrand().getName() : null);
                    dto.setUnitMeasurement(product.getUnitMeasurement());

                    List<PurchaseInStockDTO> groupedPurchases = groupItemsByPurchase(product.getItems());
                    dto.setPurchases(groupedPurchases);

                    return dto;
                })
                .toList();
    }

    private List<PurchaseInStockDTO> groupItemsByPurchase(List<Item> items) {

        return items.stream()
                .filter(item -> item.getPurchase() != null)
                .collect(Collectors.groupingBy(
                        item -> item.getPurchase().getId()
                ))
                .values()
                .stream()
                .map(group -> {

                    Item reference = group.getFirst();

                    LocalDate purchaseDate = reference.getPurchase().getDate();
                    Long purchaseId = reference.getPurchase().getId();

                    LocalDate expiration =
                            group.stream()
                                    .map(Item::getExpirationDate)
                                    .filter(Objects::nonNull)
                                    .min(LocalDate::compareTo)
                                    .orElse(null);

                    BigDecimal totalQuantity =
                            group.stream()
                                    .map(Item::getQuantity)
                                    .reduce(BigDecimal.ZERO, BigDecimal::add);

                    PurchaseInStockDTO dto = new PurchaseInStockDTO();
                    dto.setPurchase_id(purchaseId);
                    dto.setPurchase_date(purchaseDate);
                    dto.setExpiring_date(expiration);
                    dto.setQuantity(totalQuantity);
										dto.setUnitSalePrice(reference.getSaleUnitPrice());

                    return dto;
                })
                .toList();
    }

}