package com.example.SpringBootApp.services;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.SpringBootApp.DTOs.VendCreateDTO;
import com.example.SpringBootApp.DTOs.VendItemDTO;
import com.example.SpringBootApp.exceptions.ResourceNotFoundException;
import com.example.SpringBootApp.models.*;
import com.example.SpringBootApp.repositories.ItemRepository;
import com.example.SpringBootApp.repositories.ProdutoRepository;
import com.example.SpringBootApp.repositories.CompraRepository;
import com.example.SpringBootApp.repositories.VendaRepository;
import com.example.SpringBootApp.repositories.UsuarioRepository;

import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class VendaService {

    private final VendaRepository vendaRepository;
    private final ItemRepository itemRepository;
    private final UsuarioRepository usuarioRepository;
    private final ProdutoRepository produtoRepository;
    private final CompraRepository compraRepository;
    
    public Venda createSale(VendCreateDTO saleDTO) {
        Usuario usuario = usuarioRepository.findById(saleDTO.getUserId()).orElseThrow(() -> new ResourceNotFoundException("Usuario not found"));

        Venda venda = new Venda();
        venda.setDataVenda(saleDTO.getSaleDate());
        venda.setValorTotal(saleDTO.getTotalValue());
        venda.setMetodoPagamento(saleDTO.getPaymentMethod());
        venda.setTemDesconto(saleDTO.getHasDiscount());
        venda.setUsuario(usuario);

        Venda savedSale = vendaRepository.save(venda);

        List<Movimentacao> items = new ArrayList<>();
        for (VendItemDTO itemDTO : saleDTO.getItems()) {
            Produto produto = produtoRepository.findById(itemDTO.getProductId())
                    .orElseThrow(() -> new ResourceNotFoundException("Produto not found with id: " + itemDTO.getProductId()));
            Compra compra = compraRepository.findById(itemDTO.getPurchaseId())
                    .orElseThrow(() -> new ResourceNotFoundException("Compra not found with id: " + itemDTO.getPurchaseId()));

            Movimentacao stockItem = itemRepository.findFirstByCompraIdAndProdutoIdAndVendaIsNull(compra.getId(), produto.getId());
            
            if (stockItem == null) {
                throw new ResourceNotFoundException("Lote de estoque não encontrado para a compra ID: " + compra.getId());
            }

            Movimentacao movimentacao = new Movimentacao();
            movimentacao.setProduto(produto);
            movimentacao.setCompra(compra);
            movimentacao.setVenda(savedSale);
            movimentacao.setQuantidade(itemDTO.getQuantity().multiply(BigDecimal.valueOf(-1)));
            movimentacao.setTipoMovimentacao(MovementType.VENDA);

            movimentacao.setPrecoUnitarioVenda(stockItem.getPrecoUnitarioVenda());
            movimentacao.setPrecoUnitarioCompra(stockItem.getPrecoUnitarioCompra());

            items.add(itemRepository.save(movimentacao));
        }

        savedSale.setItens(items);
        return savedSale;
    }
}


