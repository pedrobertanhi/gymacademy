package com.pi.projetoacademia.dto;

import com.pi.projetoacademia.model.Aula;

import java.time.LocalTime;

public record AulaRequestDTO(
        String nome,
        String professor,
        String dia,
        LocalTime horarioInicio,
        LocalTime horarioFim,
        Integer capacidade,
        Aula.StatusAula status,
        String imagem
) {
}
