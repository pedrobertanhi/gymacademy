package com.pi.projetoacademia.dto;

public record AdminRequestDTO(
        String nome,
        String email,
        String senha,
        String contato,
        String genero
) {
}
