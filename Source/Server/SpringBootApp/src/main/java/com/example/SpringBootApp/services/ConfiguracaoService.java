package com.example.SpringBootApp.services;

import com.example.SpringBootApp.DTOs.ConfiguracaoCreateDTO;
import com.example.SpringBootApp.models.Configuracao;
import com.example.SpringBootApp.repositories.ConfiguracaoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ConfiguracaoService {
    private final ConfiguracaoRepository configuracaoRepository;

    public Configuracao createConfiguracao(ConfiguracaoCreateDTO dto) {
        Configuracao c = new Configuracao();
        c.setLucroEsperado(dto.getLucroEsperado());
        c.setTaxaDebito(dto.getTaxaDebito());
        c.setTaxaCredito(dto.getTaxaCredito());
        c.setCreatedAt(LocalDateTime.now());
        c.setUpdatedAt(LocalDateTime.now());
        return configuracaoRepository.save(c);
    }

    public Optional<Configuracao> getLatestConfiguracao() {
        return configuracaoRepository.findFirstByOrderByIdDesc();
    }

    public List<Configuracao> getAllConfiguracoes() {
        return configuracaoRepository.findAllByOrderByIdDesc();
    }
}
