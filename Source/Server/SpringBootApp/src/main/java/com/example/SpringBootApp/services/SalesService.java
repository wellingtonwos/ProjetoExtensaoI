package com.example.SpringBootApp.services;

import com.example.SpringBootApp.DTOs.SaleCreateDTO;
import com.example.SpringBootApp.DTOs.SaleItemDTO;
import com.example.SpringBootApp.exceptions.ResourceNotFoundException;
import com.example.SpringBootApp.models.*;
import com.example.SpringBootApp.repositories.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class SalesService {

    private final SaleRepository saleRepository;
    private final ItemRepository itemRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final PurchaseRepository purchaseRepository;
    public Sale createSale(SaleCreateDTO saleDTO) {
        User user = userRepository.findById(saleDTO.getUserId()).orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Sale sale = new Sale();
        sale.setTimestamp(saleDTO.getTimestamp());
        sale.setPaymentMethod(saleDTO.getPaymentMethod());
        sale.setDiscount(saleDTO.getDiscount());
        sale.setUser(user);

        Sale savedSale = saleRepository.save(sale);

        List<Item> items = new ArrayList<>();
        for (SaleItemDTO itemDTO : saleDTO.getItems()) {
            Product product = productRepository.findById(itemDTO.getProductId())
                    .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + itemDTO.getProductId()));
            Purchase purchase = purchaseRepository.findById(itemDTO.getPurchaseId())
                    .orElseThrow(() -> new ResourceNotFoundException("Purchase not found with id: " + itemDTO.getPurchaseId()));

            Item item = new Item();
            item.setProduct(product);
            item.setPurchase(purchase);
            item.setSale(savedSale);
            item.setQuantity(itemDTO.getQuantity().multiply(BigDecimal.valueOf(-1)));

            items.add(itemRepository.save(item));
        }

        savedSale.setItems(items);
        return savedSale;
    }
}