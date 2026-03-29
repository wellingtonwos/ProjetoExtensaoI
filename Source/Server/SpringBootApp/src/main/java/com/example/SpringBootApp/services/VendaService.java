package com.example.SpringBootApp.services;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.SpringBootApp.DTOs.SaleCreateDTO;
import com.example.SpringBootApp.DTOs.SaleItemDTO;
import com.example.SpringBootApp.exceptions.ResourceNotFoundException;
import com.example.SpringBootApp.models.*;
import com.example.SpringBootApp.repositories.ItemRepository;
import com.example.SpringBootApp.repositories.ProductRepository;
import com.example.SpringBootApp.repositories.PurchaseRepository;
import com.example.SpringBootApp.repositories.SaleRepository;
import com.example.SpringBootApp.repositories.UserRepository;

import lombok.RequiredArgsConstructor;

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
        sale.setSaleDate(saleDTO.getSaleDate());
        sale.setTotalValue(saleDTO.getTotalValue());
        sale.setPaymentMethod(saleDTO.getPaymentMethod());
        sale.setHasDiscount(saleDTO.getHasDiscount());
        sale.setUser(user);

        Sale savedSale = saleRepository.save(sale);

        List<Item> items = new ArrayList<>();
        for (SaleItemDTO itemDTO : saleDTO.getItems()) {
            Product product = productRepository.findById(itemDTO.getProductId())
                    .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + itemDTO.getProductId()));
            Purchase purchase = purchaseRepository.findById(itemDTO.getPurchaseId())
                    .orElseThrow(() -> new ResourceNotFoundException("Purchase not found with id: " + itemDTO.getPurchaseId()));

            Item stockItem = itemRepository.findFirstByPurchaseIdAndProductIdAndSaleIsNull(purchase.getId(), product.getId());
            
            if (stockItem == null) {
                throw new ResourceNotFoundException("Lote de estoque não encontrado para a compra ID: " + purchase.getId());
            }

            Item item = new Item();
            item.setProduct(product);
            item.setPurchase(purchase);
            item.setSale(savedSale);
            item.setQuantity(itemDTO.getQuantity().multiply(BigDecimal.valueOf(-1)));
            item.setMovementType(MovementType.VENDA);

            item.setSaleUnitPrice(stockItem.getSaleUnitPrice());
            item.setPurchaseUnitPrice(stockItem.getPurchaseUnitPrice());

            items.add(itemRepository.save(item));
        }

        savedSale.setItems(items);
        return savedSale;
    }
}