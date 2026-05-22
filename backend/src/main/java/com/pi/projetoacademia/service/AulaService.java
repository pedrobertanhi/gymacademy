package com.pi.projetoacademia.service;

import com.pi.projetoacademia.dto.AulaRequestDTO;
import com.pi.projetoacademia.dto.AulaResponseDTO;
import com.pi.projetoacademia.repository.AgendamentoRepository;
import com.pi.projetoacademia.repository.AulaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AulaService {

    private final AulaRepository aulaRepository;
    private final AgendamentoRepository agendamentoRepository;

    public List<AulaResponseDTO> listar() {
        // TODO: listar todas as aulas, calcular agendados via agendamentoRepository.countByAulaId().
        throw new UnsupportedOperationException("TODO: implementar AulaService.listar");
    }

    public AulaResponseDTO buscarPorId(Long id) {
        // TODO: buscar por id, lançar 404 se não encontrado.
        throw new UnsupportedOperationException("TODO: implementar AulaService.buscarPorId");
    }

    public AulaResponseDTO criar(AulaRequestDTO request) {
        // TODO: persistir nova aula com status default ABERTA.
        throw new UnsupportedOperationException("TODO: implementar AulaService.criar");
    }

    public AulaResponseDTO atualizar(Long id, AulaRequestDTO request) {
        // TODO: atualizar aula existente.
        throw new UnsupportedOperationException("TODO: implementar AulaService.atualizar");
    }

    public void cancelar(Long id) {
        // TODO: setar status = CANCELADA.
        throw new UnsupportedOperationException("TODO: implementar AulaService.cancelar");
    }
}
