package com.example.SpringBootApp.controllers;

import com.example.SpringBootApp.DTOs.AuthResponseDTO;
import com.example.SpringBootApp.DTOs.LoginDTO;
import com.example.SpringBootApp.services.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/sessions")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping
    public ResponseEntity<AuthResponseDTO> login(@Valid @RequestBody LoginDTO loginDTO) {
        AuthResponseDTO response = authService.authenticate(loginDTO);
        return ResponseEntity.ok(response);
    }
}