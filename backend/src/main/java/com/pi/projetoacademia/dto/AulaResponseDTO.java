package com.pi.projetoacademia.dto;

import com.pi.projetoacademia.model.Aula;

import java.time.LocalTime;

public record AulaResponseDTO(
        Long id,
        String nome,
        String professor,
        String dia,
        LocalTime horarioInicio,
        LocalTime horarioFim,
        Integer capacidade,
        long agendados,
        Aula.StatusAula status,
        String imagem
) {
}
