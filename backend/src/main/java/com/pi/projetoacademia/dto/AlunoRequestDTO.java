package com.pi.projetoacademia.dto;

import jakarta.validation.constraints.NotBlank;

import java.time.LocalDate;

public record AlunoRequestDTO(
        String nome,
        String email,
        String contato,
        String cpf,
        String genero,
        LocalDate planoInicio,
        LocalDate planoFim,
        Boolean ativo,
        @NotBlank(message = "A senha é obrigatória")
        String senha
) {
}
