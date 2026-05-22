package com.pi.projetoacademia.dto;

import java.time.LocalDate;

public record AlunoResponseDTO(
        Long id,
        String nome,
        String email,
        String contato,
        String cpf,
        String genero,
        LocalDate planoInicio,
        LocalDate planoFim,
        boolean ativo,
        boolean planoVencido
) {
}
