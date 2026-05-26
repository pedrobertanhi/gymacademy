package com.pi.projetoacademia.dto;

import java.time.LocalDateTime;

public record AcessoResponseDTO(
        String nomeAluno,
        LocalDateTime momento,
        boolean liberado,
        String motivo
) {
}
