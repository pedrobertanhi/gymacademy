package com.pi.projetoacademia.dto;

import java.time.LocalDate;

public record AlunoRequestDTO(
        String nome,
        String email,
        String contato,
        String cpf,
        String genero,
        LocalDate planoInicio,
        LocalDate planoFim,
        Boolean ativo
) {
}
