package com.example.SpringBootApp.services;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.SpringBootApp.DTOs.SaleCreateDTO;
import com.example.SpringBootApp.DTOs.SaleItemDTO;
import com.example.SpringBootApp.exceptions.ResourceNotFoundException;
import com.example.SpringBootApp.models.Item;
import com.example.SpringBootApp.models.Product;
import com.example.SpringBootApp.models.Purchase;
import com.example.SpringBootApp.models.Sale;
import com.example.SpringBootApp.models.User;
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

						Item stockItem = itemRepository.findFirstByPurchaseIdAndSaleIsNull(purchase.getId());
            
            if (stockItem == null) {
                throw new ResourceNotFoundException("Lote de estoque não encontrado para a compra ID: " + purchase.getId());
            }

            Item item = new Item();
            item.setProduct(product);
            item.setPurchase(purchase);
            item.setSale(savedSale);
            item.setQuantity(itemDTO.getQuantity().multiply(BigDecimal.valueOf(-1)));

						item.setSaleUnitPrice(stockItem.getSaleUnitPrice());
						item.setPurchaseUnitPrice(stockItem.getPurchaseUnitPrice());

            items.add(itemRepository.save(item));
        }

        savedSale.setItems(items);
        return savedSale;
    }
}