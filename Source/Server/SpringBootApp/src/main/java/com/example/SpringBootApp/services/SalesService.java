package com.example.SpringBootApp.services;

import com.example.SpringBootApp.DTOs.SaleCreateDTO;
import com.example.SpringBootApp.models.*;
import com.example.SpringBootApp.repositories.SaleRepository;
import com.example.SpringBootApp.repositories.ItemRepository;
import com.example.SpringBootApp.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
@RequiredArgsConstructor
public class SalesService {

    private final SaleRepository saleRepository;
    private final ItemRepository itemRepository;
    private final UserRepository userRepository;
    public Sale createSale(SaleCreateDTO saleDTO) {
       return new Sale();
    }

}