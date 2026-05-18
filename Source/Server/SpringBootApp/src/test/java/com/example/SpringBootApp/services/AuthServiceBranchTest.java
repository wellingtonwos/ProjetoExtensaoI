package com.example.SpringBootApp.services;

import com.example.SpringBootApp.DTOs.LoginDTO;
import com.example.SpringBootApp.DTOs.MessageResponseDTO;
import com.example.SpringBootApp.DTOs.ResetPasswordDTO;
import com.example.SpringBootApp.models.RecuperacaoSenhaToken;
import com.example.SpringBootApp.models.Usuario;
import com.example.SpringBootApp.repositories.RecuperacaoSenhaTokenRepository;
import com.example.SpringBootApp.repositories.UsuarioRepository;
import org.junit.jupiter.api.Test;

import org.springframework.security.crypto.password.PasswordEncoder;
import com.example.SpringBootApp.infra.JwtTokenProvider;

import java.time.LocalDateTime;
import com.example.SpringBootApp.models.AccessLevel;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class AuthServiceBranchTest {

    @Test
    public void authenticate_success() {
        UsuarioRepository ur = mock(UsuarioRepository.class);
        RecuperacaoSenhaTokenRepository rr = mock(RecuperacaoSenhaTokenRepository.class);
        PasswordEncoder pe = mock(PasswordEncoder.class);
        JwtTokenProvider tp = mock(JwtTokenProvider.class);
        EmailService es = mock(EmailService.class);

        AuthService svc = new AuthService(ur, rr, pe, tp, es);

        Usuario u = new Usuario();
        u.setId(10L);
        u.setNome("john");
        u.setSenha("hash");
        u.setAccessLevel(AccessLevel.ADM);

        LoginDTO dto = new LoginDTO();
        dto.setIdentifier("john");
        dto.setPassword("plain");

        when(ur.findByNome("john")).thenReturn(Optional.of(u));
        when(pe.matches("plain", "hash")).thenReturn(true);
        when(tp.generateToken(u)).thenReturn("tok123");

        var resp = svc.authenticate(dto);
        assertEquals("tok123", resp.getToken());
        assertEquals("Bearer", resp.getType());
    }

    @Test
    public void authenticate_wrongPassword_throws() {
        UsuarioRepository ur = mock(UsuarioRepository.class);
        RecuperacaoSenhaTokenRepository rr = mock(RecuperacaoSenhaTokenRepository.class);
        PasswordEncoder pe = mock(PasswordEncoder.class);
        JwtTokenProvider tp = mock(JwtTokenProvider.class);
        EmailService es = mock(EmailService.class);

        AuthService svc = new AuthService(ur, rr, pe, tp, es);

        Usuario u = new Usuario(); u.setNome("j"); u.setSenha("h");
        LoginDTO dto = new LoginDTO(); dto.setIdentifier("j"); dto.setPassword("p");

        when(ur.findByNome("j")).thenReturn(Optional.of(u));
        when(pe.matches("p", "h")).thenReturn(false);

        assertThrows(RuntimeException.class, () -> svc.authenticate(dto));
    }

    @Test
    public void requestPasswordRecovery_nonexistentUser_returnsGeneric() {
        UsuarioRepository ur = mock(UsuarioRepository.class);
        RecuperacaoSenhaTokenRepository rr = mock(RecuperacaoSenhaTokenRepository.class);
        PasswordEncoder pe = mock(PasswordEncoder.class);
        JwtTokenProvider tp = mock(JwtTokenProvider.class);
        EmailService es = mock(EmailService.class);

        AuthService svc = new AuthService(ur, rr, pe, tp, es);

        var resp = svc.requestPasswordRecovery(new com.example.SpringBootApp.DTOs.PasswordRecoveryRequestDTO() {{ setEmail("no@x"); }});
        assertNotNull(resp);
        assertTrue(resp.getMessage().contains("If your email is registered"));
        verify(rr, never()).save(any());
    }

    @Test
    public void requestPasswordRecovery_rateLimited_returnsGeneric() {
        UsuarioRepository ur = mock(UsuarioRepository.class);
        RecuperacaoSenhaTokenRepository rr = mock(RecuperacaoSenhaTokenRepository.class);
        PasswordEncoder pe = mock(PasswordEncoder.class);
        JwtTokenProvider tp = mock(JwtTokenProvider.class);
        EmailService es = mock(EmailService.class);

        AuthService svc = new AuthService(ur, rr, pe, tp, es);

        Usuario u = new Usuario(); u.setId(1L); u.setNome("joe"); u.setEmail("joe@x");
        when(ur.findByEmail("joe@x")).thenReturn(Optional.of(u));

        RecuperacaoSenhaToken recent = new RecuperacaoSenhaToken();
        recent.setCriadoEm(LocalDateTime.now().minusMinutes(2));
        when(rr.findFirstByUsuarioOrderByCriadoEmDesc(u)).thenReturn(Optional.of(recent));

        var resp = svc.requestPasswordRecovery(new com.example.SpringBootApp.DTOs.PasswordRecoveryRequestDTO() {{ setEmail("joe@x"); }});
        assertNotNull(resp);
        assertTrue(resp.getMessage().contains("If your email is registered"));
        verify(rr, never()).save(any());
    }

    @Test
    public void requestPasswordRecovery_success_sendsEmail() {
        UsuarioRepository ur = mock(UsuarioRepository.class);
        RecuperacaoSenhaTokenRepository rr = mock(RecuperacaoSenhaTokenRepository.class);
        PasswordEncoder pe = mock(PasswordEncoder.class);
        JwtTokenProvider tp = mock(JwtTokenProvider.class);
        EmailService es = mock(EmailService.class);

        AuthService svc = new AuthService(ur, rr, pe, tp, es);

        Usuario u = new Usuario(); u.setId(2L); u.setNome("amy"); u.setEmail("amy@x");
        when(ur.findByEmail("amy@x")).thenReturn(Optional.of(u));
        when(rr.findFirstByUsuarioOrderByCriadoEmDesc(u)).thenReturn(Optional.empty());
        when(rr.save(any())).thenAnswer(inv -> inv.getArgument(0));

        var resp = svc.requestPasswordRecovery(new com.example.SpringBootApp.DTOs.PasswordRecoveryRequestDTO() {{ setEmail("amy@x"); }});
        assertNotNull(resp);
        verify(rr).save(any());
        verify(es).sendPasswordRecoveryEmail(eq("amy@x"), eq("amy"), anyString());
    }

    @Test
    public void resetPassword_success() {
        UsuarioRepository ur = mock(UsuarioRepository.class);
        RecuperacaoSenhaTokenRepository rr = mock(RecuperacaoSenhaTokenRepository.class);
        PasswordEncoder pe = mock(PasswordEncoder.class);
        JwtTokenProvider tp = mock(JwtTokenProvider.class);
        EmailService es = mock(EmailService.class);

        AuthService svc = new AuthService(ur, rr, pe, tp, es);

        Usuario u = new Usuario(); u.setId(9L); u.setNome("bob"); u.setEmail("b@x"); u.setSenha("old");
        RecuperacaoSenhaToken token = new RecuperacaoSenhaToken();
        token.setToken("T1");
        token.setUsuario(u);
        token.setUtilizado(false);
        token.setExpiracao(LocalDateTime.now().plusHours(1));

        when(rr.findByToken("T1")).thenReturn(Optional.of(token));
        when(pe.encode("newpass")).thenReturn("enc");
        when(ur.save(any())).thenAnswer(inv -> inv.getArgument(0));
        when(rr.save(any())).thenAnswer(inv -> inv.getArgument(0));

        var resp = svc.resetPassword(new ResetPasswordDTO() {{ setToken("T1"); setNewPassword("newpass"); }});
        assertNotNull(resp);
        assertEquals("Password reset successful", resp.getMessage());
        assertTrue(token.getUtilizado());
    }
}
