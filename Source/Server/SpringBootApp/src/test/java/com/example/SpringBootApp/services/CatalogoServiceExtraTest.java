package com.example.SpringBootApp.services;

import com.example.SpringBootApp.exceptions.BusinessException;
import com.example.SpringBootApp.exceptions.ResourceNotFoundException;
import com.example.SpringBootApp.models.Produto;
import com.example.SpringBootApp.repositories.MarcaRepository;
import com.example.SpringBootApp.repositories.CategoriaRepository;
import com.example.SpringBootApp.repositories.ProdutoRepository;
import com.example.SpringBootApp.repositories.MovimentacaoRepository;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class CatalogoServiceExtraTest {

    @Test
    public void deleteProduct_used_throws() {
        ProdutoRepository pr = mock(ProdutoRepository.class);
        CategoriaRepository cr = mock(CategoriaRepository.class);
        MarcaRepository mr = mock(MarcaRepository.class);
        MovimentacaoRepository movr = mock(MovimentacaoRepository.class);

        Produto p = new Produto(); p.setId(5L);
        when(pr.findById(5L)).thenReturn(Optional.of(p));
        when(movr.existsByProdutoId(5L)).thenReturn(true);

        CatalogoService svc = new CatalogoService(pr, cr, mr, movr);

        assertThrows(BusinessException.class, () -> svc.deleteProduct(5L));
    }

    @Test
    public void updateProductPrice_null_throws() {
        ProdutoRepository pr = mock(ProdutoRepository.class);
        CategoriaRepository cr = mock(CategoriaRepository.class);
        MarcaRepository mr = mock(MarcaRepository.class);
        MovimentacaoRepository movr = mock(MovimentacaoRepository.class);

        Produto p = new Produto(); p.setId(7L);
        when(pr.findById(7L)).thenReturn(Optional.of(p));

        CatalogoService svc = new CatalogoService(pr, cr, mr, movr);

        assertThrows(BusinessException.class, () -> svc.updateProductPrice(7L, null));
    }
}
