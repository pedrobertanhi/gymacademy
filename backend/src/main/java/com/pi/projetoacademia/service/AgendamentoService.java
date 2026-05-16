package com.pi.projetoacademia.service;

import com.pi.projetoacademia.dto.AgendamentoRequestDTO;
import com.pi.projetoacademia.repository.AgendamentoRepository;
import com.pi.projetoacademia.repository.AlunoRepository;
import com.pi.projetoacademia.repository.AulaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AgendamentoService {

    private final AgendamentoRepository agendamentoRepository;
    private final AlunoRepository alunoRepository;
    private final AulaRepository aulaRepository;

    public Long agendar(AgendamentoRequestDTO request) {
        // TODO: validar aluno existe e está com plano ativo,
        //       validar aula existe, status != CANCELADA,
        //       validar capacidade (countByAulaId < capacidade),
        //       validar não duplicar (existsByAlunoIdAndAulaId),
        //       persistir Agendamento e retornar id.
        throw new UnsupportedOperationException("TODO: implementar AgendamentoService.agendar");
    }

    public void cancelar(Long alunoId, Long aulaId) {
        // TODO: deletar agendamento por alunoId+aulaId.
        throw new UnsupportedOperationException("TODO: implementar AgendamentoService.cancelar");
    }
}
