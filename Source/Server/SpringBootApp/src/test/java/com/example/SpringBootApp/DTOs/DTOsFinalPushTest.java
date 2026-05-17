package com.example.SpringBootApp.DTOs;

import org.junit.jupiter.api.Test;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.*;

public class DTOsFinalPushTest {

    @Test
    public void marcaCreateDTO() {
        MarcaCreateDTO a = new MarcaCreateDTO("Friboi");
        MarcaCreateDTO b = new MarcaCreateDTO();
        b.setName("Friboi");
        assertEquals(a, b);
        assertEquals(a.hashCode(), b.hashCode());
        assertTrue(a.equals(a));
        assertFalse(a.equals(null));
        assertFalse(a.equals("x"));
        assertNotNull(a.toString());
    }

    @Test
    public void validateRecoveryCodeDTO() {
        ValidateRecoveryCodeDTO a = new ValidateRecoveryCodeDTO();
        a.setToken("t1");
        ValidateRecoveryCodeDTO b = new ValidateRecoveryCodeDTO();
        b.setToken("t1");
        assertEquals(a, b);
        assertTrue(a.equals(a));
        assertFalse(a.equals(null));
        assertFalse(a.equals("x"));
        assertNotNull(a.toString());
    }

    @Test
    public void passwordRecoveryRequestDTO() {
        PasswordRecoveryRequestDTO a = new PasswordRecoveryRequestDTO();
        a.setEmail("x@example.com");
        PasswordRecoveryRequestDTO b = new PasswordRecoveryRequestDTO();
        b.setEmail("x@example.com");
        assertEquals(a, b);
        assertTrue(a.equals(a));
        assertFalse(a.equals(null));
        assertFalse(a.equals("x"));
        assertNotNull(a.toString());
    }

    @Test
    public void categoriaCreateDTO() {
        CategoriaCreateDTO a = new CategoriaCreateDTO("Bovino");
        CategoriaCreateDTO b = new CategoriaCreateDTO();
        b.setName("Bovino");
        assertEquals(a, b);
        assertEquals(a.hashCode(), b.hashCode());
        assertTrue(a.equals(a));
        assertFalse(a.equals(null));
        assertFalse(a.equals("x"));
        assertNotNull(a.toString());
    }

    @Test
    public void produtoPrecoUpdateDTO() {
        ProdutoPrecoUpdateDTO a = new ProdutoPrecoUpdateDTO(new BigDecimal("12.50"));
        ProdutoPrecoUpdateDTO b = new ProdutoPrecoUpdateDTO();
        b.setPrecoVenda(new BigDecimal("12.50"));
        assertEquals(a, b);
        assertEquals(a.hashCode(), b.hashCode());
        assertTrue(a.equals(a));
        assertFalse(a.equals(null));
        assertFalse(a.equals("x"));
        assertNotNull(a.toString());
    }

    @Test
    public void messageResponseDTO() {
        MessageResponseDTO a = new MessageResponseDTO("ok");
        MessageResponseDTO b = new MessageResponseDTO("ok");
        assertEquals(a, b);
        assertTrue(a.equals(a));
        assertFalse(a.equals(null));
        assertFalse(a.equals("x"));
        assertNotNull(a.toString());
    }

}
