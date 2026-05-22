package com.example.SpringBootApp.DTOs;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ClienteResponseDTO {
    private Long id;
    private String nickname;
    private String telefone;
    private java.time.LocalDate aniversario;
    private LocalDateTime dataCadastro;
}
