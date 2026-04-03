package com.example.SpringBootApp.services;

import com.example.SpringBootApp.DTOs.ProdutoComCompraEmEstoqueDTO;
import com.example.SpringBootApp.DTOs.CompraCreateDTO;
import com.example.SpringBootApp.DTOs.CompraEmEstoqueDTO;
import com.example.SpringBootApp.DTOs.CompraItemDTO;
import com.example.SpringBootApp.exceptions.ResourceNotFoundException;
import com.example.SpringBootApp.models.*;
import com.example.SpringBootApp.repositories.CompraRepository;
import com.example.SpringBootApp.repositories.ItemRepository;
import com.example.SpringBootApp.repositories.ProdutoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class InventarioService {

    private final CompraRepository CompraRepository;
    private final ItemRepository itemRepository;
    private final ProdutoRepository ProdutoRepository;

    public Compra createPurchase(CompraCreateDTO purchaseDTO) {
        for (CompraItemDTO itemDTO : purchaseDTO.getItems()) {
            ProdutoRepository.findById(itemDTO.getProductId())
                    .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + itemDTO.getProductId()));
        }

        Compra Compra = new Compra();
        Compra.setDataCompra(purchaseDTO.getDate() != null ? purchaseDTO.getDate() : LocalDate.now());

        Compra savedPurchase = CompraRepository.save(Compra);

        List<Movimentacao> items = new ArrayList<>();
        for (CompraItemDTO itemDTO : purchaseDTO.getItems()) {
            Produto Produto = ProdutoRepository.findById(itemDTO.getProductId()).get();

            Movimentacao Movimentacao = new Movimentacao();
            Movimentacao.setQuantidade(itemDTO.getQuantity());
            Movimentacao.setPrecoUnitarioCompra(itemDTO.getUnitPurchasePrice());
            Movimentacao.setPrecoUnitarioVenda(itemDTO.getUnitSalePrice());
            Movimentacao.setDataValidade(itemDTO.getExpiringDate());
            Movimentacao.setProduto(Produto);
            Movimentacao.setCompra(savedPurchase);
            Movimentacao.setVenda(null);
            Movimentacao.setTipoMovimentacao(MovementType.COMPRA);

            items.add(itemRepository.save(Movimentacao));
        }

        savedPurchase.setItens(items);
        return savedPurchase;
    }

    public List<ProdutoComCompraEmEstoqueDTO> getProductsWithPurchaseInStock(){
        List<Produto> products = ProdutoRepository.findAllWithItems()
                .stream()
                .filter(Produto -> !Produto.getItens().isEmpty())
                .toList();
        return products.stream()
                .map(Produto -> {

                    ProdutoComCompraEmEstoqueDTO dto = new ProdutoComCompraEmEstoqueDTO();

                    dto.setId(Produto.getId().intValue());
                    dto.setCode(Produto.getCodigo());
                    dto.setProduct_name(Produto.getNome());
                    dto.setBrand_name(Produto.getMarca() != null ? Produto.getMarca().getNome() : null);
                    dto.setUnitMeasurement(Produto.getUnidadeMedida());

                    List<CompraEmEstoqueDTO> groupedPurchases = groupItemsByPurchase(Produto.getItens());
                    dto.setPurchases(groupedPurchases);

                    return dto;
                })
                .toList();
    }

    private List<CompraEmEstoqueDTO> groupItemsByPurchase(List<Movimentacao> items) {

        return items.stream()
                .filter(Movimentacao -> Movimentacao.getCompra() != null)
                .collect(Collectors.groupingBy(
                        Movimentacao -> Movimentacao.getCompra().getId()
                ))
                .values()
                .stream()
                .map(group -> {

                    Movimentacao reference = group.getFirst();

                    LocalDate purchaseDate = reference.getCompra().getDataCompra();
                    Long purchaseId = reference.getCompra().getId();

                    LocalDate expiration =
                            group.stream()
                                    .map(Movimentacao::getDataValidade)
                                    .filter(Objects::nonNull)
                                    .min(LocalDate::compareTo)
                                    .orElse(null);

                    BigDecimal totalQuantity =
                            group.stream()
                                    .map(Movimentacao::getQuantidade)
                                    .reduce(BigDecimal.ZERO, BigDecimal::add);

                    CompraEmEstoqueDTO dto = new CompraEmEstoqueDTO();
                    dto.setPurchase_id(purchaseId);
                    dto.setPurchase_date(purchaseDate);
                    dto.setExpiring_date(expiration);
                    dto.setQuantity(totalQuantity);
                    dto.setUnitSalePrice(reference.getPrecoUnitarioVenda());

                    return dto;
                })
                .toList();
    }

}



