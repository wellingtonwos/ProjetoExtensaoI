package com.example.SpringBootApp.controllers;

import com.example.SpringBootApp.DTOs.VendCreateDTO;
import com.example.SpringBootApp.DTOs.VendReportDTO;
import com.example.SpringBootApp.models.Venda;
import com.example.SpringBootApp.services.RelatorioService;
import com.example.SpringBootApp.services.VendaService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/sales")
@RequiredArgsConstructor
public class VendaController {

    private final VendaService VendaService;
    private final RelatorioService RelatorioService;

    @Operation(summary = "Create a new Venda")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Venda created successfully"),
            @ApiResponse(responseCode = "404", description = "Usuario or Compra Movimentacao not found"),
            @ApiResponse(responseCode = "400", description = "Invalid input data"),
            @ApiResponse(responseCode = "422", description = "Insufficient quantity")
    })
    @PostMapping
    public ResponseEntity<?> createSale(@Valid @RequestBody VendCreateDTO saleDTO) {
        Venda Venda = VendaService.createSale(saleDTO);
        return ResponseEntity.created(URI.create("/sales/" + Venda.getId())).build();
    }

    @GetMapping
    public ResponseEntity<List<VendReportDTO>> getSalesReport(@RequestParam LocalDate startDate,
                                                              @RequestParam LocalDate endDate) {
        List<VendReportDTO> sales = RelatorioService.getSalesReport(startDate, endDate);
        return ResponseEntity.ok(sales);
    }

}

