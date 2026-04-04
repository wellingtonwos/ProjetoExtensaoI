package com.example.SpringBootApp.services;

import com.example.SpringBootApp.DTOs.CompraCreateDTO;
import com.example.SpringBootApp.DTOs.CompraItemDTO;
import com.example.SpringBootApp.exceptions.ResourceNotFoundException;
import com.example.SpringBootApp.models.*;
import com.example.SpringBootApp.repositories.CompraRepository;
import com.example.SpringBootApp.repositories.ItemRepository;
import com.example.SpringBootApp.repositories.ProdutoRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class InventarioServiceTest {

    @Mock
    private CompraRepository compraRepository;

    @Mock
    private ItemRepository itemRepository;

    @Mock
    private ProdutoRepository produtoRepository;

    @InjectMocks
    private InventarioService inventarioService;

    @Test
    void createCompra_ShouldReturnCompra_WhenValidInput() {
        // Arrange
        CompraItemDTO item1 = new CompraItemDTO(1L, new BigDecimal("10.5"), new BigDecimal("45.90"), new BigDecimal("69.90"), LocalDate.of(2024, 2, 15));
        CompraItemDTO item2 = new CompraItemDTO(2L, new BigDecimal("5.0"), new BigDecimal("32.50"), new BigDecimal("49.90"), LocalDate.of(2024, 3, 1));
        CompraCreateDTO compraDTO = new CompraCreateDTO(LocalDate.of(2024, 1, 15), List.of(item1, item2));

        Produto produto1 = new Produto();
        produto1.setId(1L);
        produto1.setNome("Picanha");
        produto1.setUnidadeMedida(UnitMeasurement.KG);
        produto1.setCodigo("000001");
        
        Produto produto2 = new Produto();
        produto2.setId(2L);
        produto2.setNome("Alcatra");
        produto2.setUnidadeMedida(UnitMeasurement.KG);
        produto2.setCodigo("000002");

        Compra savedCompra = new Compra();
        savedCompra.setId(1L);
        savedCompra.setDataCompra(LocalDate.of(2024, 1, 15));
        
        Movimentacao savedItem1 = new Movimentacao();
        savedItem1.setId(1L);
        savedItem1.setQuantidade(new BigDecimal("10.5"));
        savedItem1.setPrecoUnitarioCompra(new BigDecimal("45.90"));
        savedItem1.setPrecoUnitarioVenda(new BigDecimal("69.90"));
        savedItem1.setDataValidade(LocalDate.of(2024, 2, 15));
        savedItem1.setProduto(produto1);
        savedItem1.setCompra(savedCompra);
        savedItem1.setTipoMovimentacao(MovementType.COMPRA);
        
        Movimentacao savedItem2 = new Movimentacao();
        savedItem2.setId(2L);
        savedItem2.setQuantidade(new BigDecimal("5.0"));
        savedItem2.setPrecoUnitarioCompra(new BigDecimal("32.50"));
        savedItem2.setPrecoUnitarioVenda(new BigDecimal("49.90"));
        savedItem2.setDataValidade(LocalDate.of(2024, 3, 1));
        savedItem2.setProduto(produto2);
        savedItem2.setCompra(savedCompra);
        savedItem2.setTipoMovimentacao(MovementType.COMPRA);

        when(compraRepository.save(any(Compra.class))).thenReturn(savedCompra);
        when(produtoRepository.findById(1L)).thenReturn(Optional.of(produto1));
        when(produtoRepository.findById(2L)).thenReturn(Optional.of(produto2));
        when(itemRepository.save(any(Movimentacao.class))).thenReturn(savedItem1, savedItem2);

        // Act
        Compra result = inventarioService.createPurchase(compraDTO);

        // Assert
        assertNotNull(result);
        assertEquals(LocalDate.of(2024, 1, 15), result.getDataCompra());
        assertEquals(1L, result.getId());

        verify(compraRepository).save(any(Compra.class));
        verify(produtoRepository, times(2)).findById(1L);
        verify(produtoRepository, times(2)).findById(2L);
        verify(itemRepository, times(2)).save(any(Movimentacao.class));
    }

    @Test
    void createCompra_ShouldUseCurrentDate_WhenDateIsNull() {
        // Arrange
        CompraItemDTO item = new CompraItemDTO(1L, new BigDecimal("10.5"), new BigDecimal("45.90"), new BigDecimal("69.90"), null);
        CompraCreateDTO compraDTO = new CompraCreateDTO(null, List.of(item));

        Produto produto = new Produto();
        produto.setId(1L);
        produto.setNome("Picanha");
        produto.setUnidadeMedida(UnitMeasurement.KG);
        produto.setCodigo("000001");
        
        Compra savedCompra = new Compra();
        savedCompra.setId(1L);
        savedCompra.setDataCompra(LocalDate.now());
        
        Movimentacao savedItem = new Movimentacao();
        savedItem.setId(1L);
        savedItem.setQuantidade(new BigDecimal("10.5"));
        savedItem.setPrecoUnitarioCompra(new BigDecimal("45.90"));
        savedItem.setPrecoUnitarioVenda(new BigDecimal("69.90"));
        savedItem.setProduto(produto);
        savedItem.setCompra(savedCompra);
        savedItem.setTipoMovimentacao(MovementType.COMPRA);

        when(compraRepository.save(any(Compra.class))).thenReturn(savedCompra);
        when(produtoRepository.findById(1L)).thenReturn(Optional.of(produto));
        when(itemRepository.save(any(Movimentacao.class))).thenReturn(savedItem);

        // Act
        Compra result = inventarioService.createPurchase(compraDTO);

        // Assert
        assertNotNull(result);
        assertEquals(LocalDate.now(), result.getDataCompra());
    }

    @Test
    void createCompra_ShouldThrowException_WhenProdutoNotFound() {
        // Arrange
        CompraItemDTO item = new CompraItemDTO(999L, new BigDecimal("10.5"), new BigDecimal("45.90"), new BigDecimal("69.90"), null);
        CompraCreateDTO compraDTO = new CompraCreateDTO(LocalDate.now(), List.of(item));

        when(produtoRepository.findById(999L)).thenReturn(Optional.empty());

        // Act & Assert
        ResourceNotFoundException exception = assertThrows(ResourceNotFoundException.class,
                () -> inventarioService.createPurchase(compraDTO));

        assertEquals("Product not found with id: 999", exception.getMessage());
        verify(produtoRepository).findById(999L);
        verify(compraRepository, never()).save(any());
        verify(itemRepository, never()).save(any());
    }

    @Test
    void createCompra_ShouldCreateMovimentacoesWithCorrectData() {
        // Arrange
        LocalDate expiringDate = LocalDate.of(2024, 2, 15);
        CompraItemDTO itemDTO = new CompraItemDTO(1L, new BigDecimal("10.5"), new BigDecimal("45.90"), new BigDecimal("69.90"), expiringDate);
        CompraCreateDTO compraDTO = new CompraCreateDTO(LocalDate.now(), List.of(itemDTO));

        Produto produto = new Produto();
        produto.setId(1L);
        produto.setNome("Picanha");
        produto.setUnidadeMedida(UnitMeasurement.KG);
        produto.setCodigo("000001");
        
        Compra savedCompra = new Compra();
        savedCompra.setId(1L);
        savedCompra.setDataCompra(LocalDate.now());

        when(compraRepository.save(any(Compra.class))).thenReturn(savedCompra);
        when(produtoRepository.findById(1L)).thenReturn(Optional.of(produto));

        when(itemRepository.save(any(Movimentacao.class))).thenAnswer(invocation -> {
            Movimentacao movimentacao = invocation.getArgument(0);
            assertEquals(new BigDecimal("10.5"), movimentacao.getQuantidade());
            assertEquals(new BigDecimal("45.90"), movimentacao.getPrecoUnitarioCompra());
            assertEquals(new BigDecimal("69.90"), movimentacao.getPrecoUnitarioVenda());
            assertEquals(expiringDate, movimentacao.getDataValidade());
            assertEquals(produto, movimentacao.getProduto());
            assertEquals(savedCompra, movimentacao.getCompra());
            assertNull(movimentacao.getVenda());
            assertEquals(MovementType.COMPRA, movimentacao.getTipoMovimentacao());
            
            Movimentacao returnItem = new Movimentacao();
            returnItem.setId(1L);
            returnItem.setQuantidade(movimentacao.getQuantidade());
            returnItem.setPrecoUnitarioCompra(movimentacao.getPrecoUnitarioCompra());
            returnItem.setPrecoUnitarioVenda(movimentacao.getPrecoUnitarioVenda());
            returnItem.setDataValidade(movimentacao.getDataValidade());
            returnItem.setProduto(movimentacao.getProduto());
            returnItem.setCompra(movimentacao.getCompra());
            returnItem.setTipoMovimentacao(movimentacao.getTipoMovimentacao());
            return returnItem;
        });

        // Act
        Compra result = inventarioService.createPurchase(compraDTO);

        // Assert
        assertNotNull(result);
        verify(itemRepository).save(any(Movimentacao.class));
    }
}

