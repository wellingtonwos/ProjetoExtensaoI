package com.example.SpringBootApp.services;

import com.example.SpringBootApp.exceptions.BusinessException;
import com.example.SpringBootApp.exceptions.ResourceNotFoundException;
import com.example.SpringBootApp.models.Movimentacao;
import com.example.SpringBootApp.models.Produto;
import com.example.SpringBootApp.models.UnitMeasurement;
import com.example.SpringBootApp.repositories.CompraRepository;
import com.example.SpringBootApp.repositories.MovimentacaoRepository;
import com.example.SpringBootApp.repositories.ProdutoRepository;
import com.example.SpringBootApp.repositories.DecarteRepository;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class InventarioServiceUpdateTests {

    @Test
    public void updatePurchaseItem_purchaseNotFound_throws() {
        CompraRepository cr = mock(CompraRepository.class);
        MovimentacaoRepository mr = mock(MovimentacaoRepository.class);
        ProdutoRepository pr = mock(ProdutoRepository.class);
        DecarteRepository dr = mock(DecarteRepository.class);

        when(mr.findFirstByCompraIdAndProdutoIdAndVendaIsNull(1L, 2L)).thenReturn(null);

        InventarioService svc = new InventarioService(cr, mr, pr, dr);

        assertThrows(ResourceNotFoundException.class, () -> svc.updatePurchaseItem(1L, 2L, new BigDecimal("1"), null, null));
    }

    @Test
    public void updatePurchaseItem_negativeUnitPrice_throws() {
        CompraRepository cr = mock(CompraRepository.class);
        MovimentacaoRepository mr = mock(MovimentacaoRepository.class);
        ProdutoRepository pr = mock(ProdutoRepository.class);
        DecarteRepository dr = mock(DecarteRepository.class);

        Movimentacao purchaseMov = new Movimentacao();
        Produto produto = new Produto();
        produto.setId(2L);
        produto.setUnidadeMedida(UnitMeasurement.KG);
        purchaseMov.setProduto(produto);
        purchaseMov.setQuantidade(new BigDecimal("5"));

        when(mr.findFirstByCompraIdAndProdutoIdAndVendaIsNull(1L, 2L)).thenReturn(purchaseMov);
        when(mr.findByCompraIdAndProdutoId(1L, 2L)).thenReturn(List.of(purchaseMov));
        when(mr.sumQuantityByProdutoId(2L)).thenReturn(new BigDecimal("10"));
        when(mr.save(any())).thenAnswer(inv -> inv.getArgument(0));

        InventarioService svc = new InventarioService(cr, mr, pr, dr);

        assertThrows(BusinessException.class, () -> svc.updatePurchaseItem(1L, 2L, new BigDecimal("3"), new BigDecimal("-1"), null));
    }

    @Test
    public void updatePurchaseItem_totalAfterNegative_throws() {
        CompraRepository cr = mock(CompraRepository.class);
        MovimentacaoRepository mr = mock(MovimentacaoRepository.class);
        ProdutoRepository pr = mock(ProdutoRepository.class);
        DecarteRepository dr = mock(DecarteRepository.class);

        Movimentacao purchaseMov = new Movimentacao();
        Produto produto = new Produto();
        produto.setId(2L);
        produto.setUnidadeMedida(UnitMeasurement.KG);
        purchaseMov.setProduto(produto);
        purchaseMov.setQuantidade(new BigDecimal("5"));

        when(mr.findFirstByCompraIdAndProdutoIdAndVendaIsNull(1L, 2L)).thenReturn(purchaseMov);
        when(mr.findByCompraIdAndProdutoId(1L, 2L)).thenReturn(List.of(purchaseMov));
        // totalSum smaller than old quantity so totalAfter becomes negative
        when(mr.sumQuantityByProdutoId(2L)).thenReturn(new BigDecimal("1"));

        InventarioService svc = new InventarioService(cr, mr, pr, dr);

        assertThrows(BusinessException.class, () -> svc.updatePurchaseItem(1L, 2L, new BigDecimal("1"), null, null));
    }
}
