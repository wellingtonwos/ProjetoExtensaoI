package com.example.SpringBootApp.mappers;

import com.example.SpringBootApp.models.Movimentacao;
import com.example.SpringBootApp.models.Produto;
import com.example.SpringBootApp.models.Compra;
import com.example.SpringBootApp.DTOs.VendaResponseDTO;
import com.example.SpringBootApp.DTOs.VendaItemResponseDTO;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.util.Arrays;

import static org.junit.jupiter.api.Assertions.*;

public class VendaMapperFilterTest {

    @Test
    public void positiveQuantity_filteredOut() {
        com.example.SpringBootApp.models.Venda v = new com.example.SpringBootApp.models.Venda();
        Movimentacao m = new Movimentacao();
        m.setQuantidade(BigDecimal.valueOf(2));
        Produto p = new Produto(); p.setId(5L); p.setNome("x");
        m.setProduto(p);
        v.setItens(Arrays.asList(m));

        VendaResponseDTO dto = VendaMapper.toResponse(v);
        assertNotNull(dto);
        assertTrue(dto.getItems().isEmpty());
    }

    @Test
    public void nullQuantity_filteredOut() {
        com.example.SpringBootApp.models.Venda v = new com.example.SpringBootApp.models.Venda();
        Movimentacao m = new Movimentacao();
        m.setQuantidade(null);
        Produto p = new Produto(); p.setId(6L); p.setNome("y");
        m.setProduto(p);
        v.setItens(Arrays.asList(m));

        VendaResponseDTO dto = VendaMapper.toResponse(v);
        assertNotNull(dto);
        assertTrue(dto.getItems().isEmpty());
    }
}
