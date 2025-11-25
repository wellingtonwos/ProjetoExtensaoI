package com.example.SpringBootApp.services;

import com.example.SpringBootApp.DTOs.AuthResponseDTO;
import com.example.SpringBootApp.DTOs.LoginDTO;
import com.example.SpringBootApp.exceptions.ResourceNotFoundException;
import com.example.SpringBootApp.infra.JwtTokenProvider;
import com.example.SpringBootApp.models.User;
import com.example.SpringBootApp.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;

    public AuthResponseDTO authenticate(LoginDTO loginDTO) {
        User user = userRepository.findByName(loginDTO.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!passwordEncoder.matches(loginDTO.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        // Gerar token
        String token = tokenProvider.generateToken(user);

        return new AuthResponseDTO(
                token,
                "Bearer",
                user.getId(),
                user.getName(),
                user.getAccessLevel().name()
        );
    }
}
