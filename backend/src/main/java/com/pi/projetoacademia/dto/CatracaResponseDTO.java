package com.pi.projetoacademia.dto;

import java.time.LocalDateTime;

public record CatracaResponseDTO(
        boolean liberado,
        String motivo,
        Long alunoId,
        String nome,
        LocalDateTime momento
) {
}
