package com.example.SpringBootApp.controllers;

import com.example.SpringBootApp.models.AccessLevel;
import com.example.SpringBootApp.models.Usuario;
import com.example.SpringBootApp.repositories.UsuarioRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class UsuarioControllerAdditionalTest {

    @Mock
    UsuarioRepository usuarioRepository;

    @Mock
    PasswordEncoder passwordEncoder;

    @InjectMocks
    UsuarioController usuarioController;

    @Test
    public void updateUser_notAdmin_sameId_success() {
        Usuario existing = new Usuario();
        existing.setId(5L);
        existing.setNome("old");
        existing.setEmail("old@x");
        existing.setSenha("enc");
        existing.setAccessLevel(AccessLevel.USUARIO);

        when(usuarioRepository.findById(5L)).thenReturn(Optional.of(existing));
        when(usuarioRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));
        when(passwordEncoder.encode("pwd")).thenReturn("enc");

        // Create authentication mock
        Authentication auth = mock(Authentication.class);
        when(auth.getAuthorities()).thenReturn(List.of(new SimpleGrantedAuthority("ROLE_USER")));
        Usuario caller = new Usuario(); caller.setId(5L);
        when(auth.getPrincipal()).thenReturn(caller);

        UsuarioController.UpdateUserDTO dto = new UsuarioController.UpdateUserDTO();
        dto.setNome("new");
        dto.setEmail("new@x");
        dto.setSenha("pwd");
        dto.setNivelAcesso(null);

        ResponseEntity<?> resp = usuarioController.updateUser(5L, dto, auth);
        assertEquals(200, resp.getStatusCodeValue());
        verify(usuarioRepository).save(any());
    }

    @Test
    public void updateUser_notAdmin_differentId_forbidden() {
        Authentication auth = mock(Authentication.class);
        when(auth.getAuthorities()).thenReturn(List.of());
        Usuario caller = new Usuario(); caller.setId(10L);
        when(auth.getPrincipal()).thenReturn(caller);

        UsuarioController.UpdateUserDTO dto = new UsuarioController.UpdateUserDTO();
        ResponseEntity<?> resp = usuarioController.updateUser(5L, dto, auth);
        assertEquals(403, resp.getStatusCodeValue());
        Map body = (Map) resp.getBody();
        assertTrue(body.get("message").toString().contains("Você só pode editar o seu próprio perfil."));
    }

    @Test
    public void updateUser_admin_allows_update() {
        Usuario existing = new Usuario();
        existing.setId(7L);
        existing.setNome("old");
        existing.setEmail("old@x");

        when(usuarioRepository.findById(7L)).thenReturn(Optional.of(existing));
        when(usuarioRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));

        Authentication auth = mock(Authentication.class);
        when(auth.getAuthorities()).thenReturn(List.of(new SimpleGrantedAuthority("ROLE_ADM")));

        UsuarioController.UpdateUserDTO dto = new UsuarioController.UpdateUserDTO();
        dto.setNome("n");
        dto.setEmail("e@x");
        dto.setSenha(null);
        dto.setNivelAcesso("ADM");

        ResponseEntity<?> resp = usuarioController.updateUser(7L, dto, auth);
        assertEquals(200, resp.getStatusCodeValue());
        verify(usuarioRepository).save(any());
    }

    @Test
    public void createUser_conflictName_returns409() {
        Usuario existing = new Usuario();
        existing.setId(3L);
        existing.setNome("dup");
        when(usuarioRepository.findByNome("dup")).thenReturn(Optional.of(existing));

        UsuarioController.CreateUserDTO dto = new UsuarioController.CreateUserDTO();
        dto.setNome("dup");
        dto.setEmail("x@x");
        dto.setSenha("s");
        dto.setNivelAcesso(null);

        ResponseEntity<?> resp = usuarioController.createUser(dto);
        assertEquals(409, resp.getStatusCodeValue());
    }

    @Test
    public void createUser_conflictEmail_returns409() {
        Usuario existing = new Usuario();
        existing.setId(4L);
        existing.setEmail("dupe@x");
        when(usuarioRepository.findByNome("unique")).thenReturn(Optional.empty());
        when(usuarioRepository.findByEmail("dupe@x")).thenReturn(Optional.of(existing));

        UsuarioController.CreateUserDTO dto = new UsuarioController.CreateUserDTO();
        dto.setNome("unique");
        dto.setEmail("dupe@x");
        dto.setSenha("s");
        dto.setNivelAcesso(null);

        ResponseEntity<?> resp = usuarioController.createUser(dto);
        assertEquals(409, resp.getStatusCodeValue());
    }
}
