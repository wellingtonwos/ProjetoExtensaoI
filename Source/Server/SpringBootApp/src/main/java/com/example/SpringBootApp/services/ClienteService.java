package com.example.SpringBootApp.services;

import com.example.SpringBootApp.DTOs.ClienteCreateDTO;
import com.example.SpringBootApp.DTOs.ClienteResponseDTO;
import com.example.SpringBootApp.exceptions.ResourceNotFoundException;
import com.example.SpringBootApp.models.Cliente;
import com.example.SpringBootApp.repositories.ClienteRepository;
import org.springframework.jdbc.core.JdbcTemplate;
import com.example.SpringBootApp.models.Permissao;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.Objects;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import com.example.SpringBootApp.models.Permissao;
import java.util.stream.Collectors;
import java.util.Optional;

@Service
@Transactional
@RequiredArgsConstructor
public class ClienteService {

    private final ClienteRepository clienteRepository;
    private JdbcTemplate jdbcTemplate;

    public Cliente createClient(ClienteCreateDTO dto) {
        Cliente c = new Cliente();
        c.setNickname(dto.getNickname());
        c.setTelefone(dto.getTelefone());
        c.setAniversario(dto.getAniversario());
        c.setDataCadastro(java.time.LocalDateTime.now());
        return clienteRepository.save(c);
    }

    public Cliente updateClient(Long id, ClienteCreateDTO dto) {
        Cliente c = clienteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente not found: " + id));
        c.setNickname(dto.getNickname());
        c.setTelefone(dto.getTelefone());
        c.setAniversario(dto.getAniversario());
        return clienteRepository.save(c);
    }

    public List<ClienteResponseDTO> listAll() {
        return clienteRepository.findAll(Sort.by("nickname").ascending())
                .stream().map(this::toDTO).toList();
    }

    public ClienteResponseDTO getById(Long id) {
        Cliente c = clienteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente not found: " + id));
        return toDTO(c);
    }

    public Page<ClienteResponseDTO> searchClients(String q, int page) {
        var pageable = PageRequest.of(page, 10);
        if (q == null || q.trim().length() < 2) return Page.empty(pageable);
        return clienteRepository.findByNicknameContainingIgnoreCase(q.trim(), pageable).map(this::toDTO);
    }

    private ClienteResponseDTO toDTO(Cliente c) {
        ClienteResponseDTO r = new ClienteResponseDTO();
        r.setId(c.getId());
        r.setNickname(c.getNickname());
        r.setTelefone(c.getTelefone());
        r.setAniversario(c.getAniversario());
        r.setDataCadastro(c.getDataCadastro());
        r.setPermissoes(getPermissoesForCliente(c.getId()));
        return r;
    }

    private List<Permissao> getPermissoesForCliente(Long clienteId) {
        if (clienteId == null || jdbcTemplate == null) return java.util.List.of();
        String sql = "SELECT tipo, aceito FROM consentimentos WHERE fk_cliente_id = ? AND capturado_em = (SELECT MAX(capturado_em) FROM consentimentos c2 WHERE c2.fk_cliente_id = ? AND c2.tipo = consentimentos.tipo)";
        List<Map<String,Object>> rows = jdbcTemplate.queryForList(sql, new Object[]{clienteId, clienteId});
        return rows.stream()
                .filter(m -> {
                    Object aceito = m.get("aceito");
                    if (aceito == null) return false;
                    if (aceito instanceof Boolean) return (Boolean) aceito;
                    if (aceito instanceof Number) return ((Number) aceito).intValue() != 0;
                    return Boolean.parseBoolean(aceito.toString());
                })
                .map(m -> {
                    Object tipoObj = m.get("tipo");
                    if (tipoObj == null) return null;
                    String tipo = tipoObj.toString();
                    try { return Permissao.valueOf(tipo); } catch (IllegalArgumentException e) { return null; }
                })
                .filter(Objects::nonNull)
                .collect(Collectors.toList());
    }
}
