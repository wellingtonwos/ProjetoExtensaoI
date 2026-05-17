package com.example.SpringBootApp.infra;

import com.example.SpringBootApp.models.Usuario;
import com.example.SpringBootApp.repositories.UsuarioRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class JwtAuthenticationFilterBranchTest {

    @BeforeEach
    public void setup() {
        SecurityContextHolder.clearContext();
    }

    @AfterEach
    public void clearContext() {
        SecurityContextHolder.clearContext();
    }

    @Test
    public void noAuthorizationHeader_callsChainWithoutAuth() throws Exception {
        JwtTokenProvider tokenProvider = mock(JwtTokenProvider.class);
        UsuarioRepository usuarioRepo = mock(UsuarioRepository.class);
        JwtAuthenticationFilter filter = new JwtAuthenticationFilter(tokenProvider, usuarioRepo);

        HttpServletRequest req = mock(HttpServletRequest.class);
        HttpServletResponse res = mock(HttpServletResponse.class);
        FilterChain chain = mock(FilterChain.class);

        when(req.getHeader("Authorization")).thenReturn(null);

        filter.doFilter(req, res, chain);

        verify(chain).doFilter(req, res);
        assertNull(SecurityContextHolder.getContext().getAuthentication());
    }

    @Test
    public void validToken_setsAuthentication() throws Exception {
        JwtTokenProvider tokenProvider = mock(JwtTokenProvider.class);
        UsuarioRepository usuarioRepo = mock(UsuarioRepository.class);
        JwtAuthenticationFilter filter = new JwtAuthenticationFilter(tokenProvider, usuarioRepo);

        HttpServletRequest req = mock(HttpServletRequest.class);
        HttpServletResponse res = mock(HttpServletResponse.class);
        FilterChain chain = mock(FilterChain.class);

        String token = "tok";
        when(req.getHeader("Authorization")).thenReturn("Bearer " + token);
        when(tokenProvider.validateToken(token)).thenReturn(true);
        when(tokenProvider.getUsernameFromToken(token)).thenReturn("john");
        when(tokenProvider.getAccessLevelFromToken(token)).thenReturn("ADM");

        Usuario u = new Usuario();
        u.setNome("john");
        when(usuarioRepo.findByNome("john")).thenReturn(Optional.of(u));

        filter.doFilter(req, res, chain);

        assertNotNull(SecurityContextHolder.getContext().getAuthentication());
        assertEquals(u, SecurityContextHolder.getContext().getAuthentication().getPrincipal());
        verify(chain).doFilter(req, res);
    }

    @Test
    public void validToken_userNotFound_noAuth() throws Exception {
        JwtTokenProvider tokenProvider = mock(JwtTokenProvider.class);
        UsuarioRepository usuarioRepo = mock(UsuarioRepository.class);
        JwtAuthenticationFilter filter = new JwtAuthenticationFilter(tokenProvider, usuarioRepo);

        HttpServletRequest req = mock(HttpServletRequest.class);
        HttpServletResponse res = mock(HttpServletResponse.class);
        FilterChain chain = mock(FilterChain.class);

        String token = "tok";
        when(req.getHeader("Authorization")).thenReturn("Bearer " + token);
        when(tokenProvider.validateToken(token)).thenReturn(true);
        when(tokenProvider.getUsernameFromToken(token)).thenReturn("noone");
        when(usuarioRepo.findByNome("noone")).thenReturn(Optional.empty());

        filter.doFilter(req, res, chain);

        assertNull(SecurityContextHolder.getContext().getAuthentication());
        verify(chain).doFilter(req, res);
    }
}
