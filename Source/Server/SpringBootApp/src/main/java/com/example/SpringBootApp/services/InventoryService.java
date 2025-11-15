package com.example.SpringBootApp.services;

import com.example.SpringBootApp.DTOs.PurchaseCreateDTO;
import com.example.SpringBootApp.DTOs.PurchaseItemDTO;
import com.example.SpringBootApp.exceptions.ResourceNotFoundException;
import com.example.SpringBootApp.models.*;
import com.example.SpringBootApp.repositories.PurchaseRepository;
import com.example.SpringBootApp.repositories.ItemRepository;
import com.example.SpringBootApp.repositories.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

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
}