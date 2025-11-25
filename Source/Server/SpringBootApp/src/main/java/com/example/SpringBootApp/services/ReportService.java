package com.example.SpringBootApp.services;

import com.example.SpringBootApp.DTOs.SaleItemReportDTO;
import com.example.SpringBootApp.DTOs.SaleReportDTO;
import com.example.SpringBootApp.models.Item;
import com.example.SpringBootApp.models.Sale;
import com.example.SpringBootApp.repositories.SaleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class ReportService {

    private final SaleRepository saleRepository;

    public List<SaleReportDTO> getSalesReport(LocalDateTime startDate, LocalDateTime endDate) {
        List<Sale> sales = saleRepository.findByTimestampBetweenWithItems(startDate, endDate);

        return sales.stream()
                .map(this::convertToSaleReportDTO)
                .collect(Collectors.toList());
    }

    private SaleReportDTO convertToSaleReportDTO(Sale sale) {
        SaleReportDTO reportDTO = new SaleReportDTO();


        reportDTO.setId(sale.getId());
        reportDTO.setTimestamp(sale.getTimestamp());
        reportDTO.setPaymentMethod(sale.getPaymentMethod().name());
        reportDTO.setSalesmanName(sale.getUser().getName());
        reportDTO.setDiscounts(sale.getDiscount());

        List<SaleItemReportDTO> itemDTOs = sale.getItems().stream()
                .filter(item -> item.getQuantity().compareTo(BigDecimal.ZERO) < 0)
                .map(this::convertToSaleItemReportDTO)
                .collect(Collectors.toList());

        reportDTO.setItems(itemDTOs);

        BigDecimal totalPrice = itemDTOs.stream()
                .map(item -> item.getSalePrice().multiply(item.getQuantity().abs()))
                .reduce(BigDecimal.ZERO, BigDecimal::add).subtract(sale.getDiscount());

        reportDTO.setTotalPrice(totalPrice);

        return reportDTO;
    }

    private SaleItemReportDTO convertToSaleItemReportDTO(Item item) {
        SaleItemReportDTO itemDTO = new SaleItemReportDTO();

        itemDTO.setProductName(item.getProduct().getName());
        itemDTO.setBrand(item.getProduct().getBrand().getName());
        itemDTO.setQuantity(item.getQuantity().abs());
        itemDTO.setPurchasePrice(item.getPurchase().getItems().getFirst().getPurchaseUnitPrice());
        itemDTO.setSalePrice(item.getPurchase().getItems().getFirst().getSaleUnitPrice());
        itemDTO.setTotal(itemDTO.getSalePrice().multiply(itemDTO.getQuantity()));

        return itemDTO;
    }
}
