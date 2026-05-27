package com.example.SpringBootApp.services;

import com.example.SpringBootApp.DTOs.DespesaCreateDTO;
import com.example.SpringBootApp.models.Despesa;
import com.example.SpringBootApp.repositories.DespesaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@RequiredArgsConstructor
@Service
public class DespesaService {
    private final DespesaRepository despesaRepository;

    public Despesa createDespesa(DespesaCreateDTO dto, Long createdBy) {
        if (dto.getDescricao() == null || dto.getDescricao().isBlank())
            throw new com.example.SpringBootApp.exceptions.BusinessException("Descrição é obrigatória");
        if (dto.getValor() == null || dto.getValor().compareTo(BigDecimal.ZERO) <= 0)
            throw new com.example.SpringBootApp.exceptions.BusinessException("Valor deve ser maior que zero");

        Despesa d = new Despesa();
        d.setDescricao(dto.getDescricao());
        d.setCategoria(dto.getCategoria());
        d.setValor(dto.getValor().setScale(2, java.math.RoundingMode.HALF_UP));
        d.setDataDespesa(dto.getDataDespesa() != null ? dto.getDataDespesa().atStartOfDay() : LocalDateTime.now());
        d.setCreatedAt(LocalDateTime.now());
        d.setUpdatedAt(LocalDateTime.now());
        d.setCreatedBy(createdBy);

        return despesaRepository.save(d);
    }

    public List<Despesa> listByDateRange(LocalDate startDate, LocalDate endDate) {
        LocalDateTime start = startDate != null ? startDate.atStartOfDay() : LocalDate.now().atStartOfDay();
        LocalDateTime end = endDate != null ? endDate.plusDays(1).atStartOfDay() : LocalDate.now().plusDays(1).atStartOfDay();
        return despesaRepository.findByDataDespesaBetween(start, end);
    }

    public Despesa updateDespesa(Long id, DespesaCreateDTO dto) {
        Despesa existing = despesaRepository.findById(id)
                .orElseThrow(() -> new com.example.SpringBootApp.exceptions.ResourceNotFoundException("Despesa not found: " + id));
        if (dto.getDescricao() != null && !dto.getDescricao().isBlank()) existing.setDescricao(dto.getDescricao());
        if (dto.getCategoria() != null) existing.setCategoria(dto.getCategoria());
        if (dto.getValor() != null && dto.getValor().compareTo(BigDecimal.ZERO) > 0) existing.setValor(dto.getValor().setScale(2, java.math.RoundingMode.HALF_UP));
        if (dto.getDataDespesa() != null) existing.setDataDespesa(dto.getDataDespesa().atStartOfDay());
        existing.setUpdatedAt(LocalDateTime.now());
        return despesaRepository.save(existing);
    }

    public void deleteDespesa(Long id) {
        if (!despesaRepository.existsById(id)) throw new com.example.SpringBootApp.exceptions.ResourceNotFoundException("Despesa not found: " + id);
        despesaRepository.deleteById(id);
    }
}
