package com.example.SpringBootApp.services;

import com.example.SpringBootApp.DTOs.ProdutoCreateDTO;
import com.example.SpringBootApp.exceptions.BusinessException;
import com.example.SpringBootApp.exceptions.ResourceAlreadyExistsException;
import com.example.SpringBootApp.exceptions.ResourceNotFoundException;
import com.example.SpringBootApp.models.Categoria;
import com.example.SpringBootApp.models.Marca;
import com.example.SpringBootApp.models.Produto;
import com.example.SpringBootApp.models.UnitMeasurement;
import com.example.SpringBootApp.repositories.MarcaRepository;
import com.example.SpringBootApp.repositories.CategoriaRepository;
import com.example.SpringBootApp.repositories.ProdutoRepository;
import com.example.SpringBootApp.repositories.MovimentacaoRepository;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class CatalogoServiceBranchTest {

    @Test
    public void createProducts_invalidCode_throws() {
        ProdutoCreateDTO dto = new ProdutoCreateDTO();
        dto.setCode("abc");

        ProdutoRepository pr = mock(ProdutoRepository.class);
        CategoriaRepository cr = mock(CategoriaRepository.class);
        MarcaRepository mr = mock(MarcaRepository.class);
        MovimentacaoRepository movr = mock(MovimentacaoRepository.class);

        CatalogoService svc = new CatalogoService(pr, cr, mr, movr);

        assertThrows(BusinessException.class, () -> svc.createProducts(dto));
    }

    @Test
    public void createProducts_success() {
        ProdutoCreateDTO dto = new ProdutoCreateDTO();
        dto.setCode("ABC123");
        dto.setName("X");
        dto.setUnitMeasurement(UnitMeasurement.KG);
        dto.setPerecivel(Boolean.FALSE);
        dto.setPrecoVenda(new BigDecimal("10.0"));
        dto.setCategoryId(1L);
        dto.setBrandId(2L);

        ProdutoRepository pr = mock(ProdutoRepository.class);
        CategoriaRepository cr = mock(CategoriaRepository.class);
        MarcaRepository mr = mock(MarcaRepository.class);
        MovimentacaoRepository movr = mock(MovimentacaoRepository.class);

        Categoria c = new Categoria(); c.setId(1L); c.setNome("cat");
        Marca m = new Marca(); m.setId(2L); m.setNome("marca");

        when(cr.findById(1L)).thenReturn(Optional.of(c));
        when(mr.findById(2L)).thenReturn(Optional.of(m));
        when(pr.existsByCodigo("ABC123")).thenReturn(false);
        when(pr.save(any())).thenAnswer(inv -> inv.getArgument(0));

        CatalogoService svc = new CatalogoService(pr, cr, mr, movr);

        Produto saved = svc.createProducts(dto);
        assertNotNull(saved);
        assertEquals("ABC123", saved.getCodigo());
        assertEquals(dto.getName(), saved.getNome());
    }

    @Test
    public void createProducts_duplicateCode_throws() {
        ProdutoCreateDTO dto = new ProdutoCreateDTO();
        dto.setCode("ABC123");
        dto.setCategoryId(1L);
        dto.setBrandId(2L);

        ProdutoRepository pr = mock(ProdutoRepository.class);
        CategoriaRepository cr = mock(CategoriaRepository.class);
        MarcaRepository mr = mock(MarcaRepository.class);
        MovimentacaoRepository movr = mock(MovimentacaoRepository.class);

        Categoria c = new Categoria(); c.setId(1L); c.setNome("cat");
        Marca m = new Marca(); m.setId(2L); m.setNome("marca");

        when(cr.findById(1L)).thenReturn(Optional.of(c));
        when(mr.findById(2L)).thenReturn(Optional.of(m));
        when(pr.existsByCodigo("ABC123")).thenReturn(true);

        CatalogoService svc = new CatalogoService(pr, cr, mr, movr);

        assertThrows(ResourceAlreadyExistsException.class, () -> svc.createProducts(dto));
    }
}
