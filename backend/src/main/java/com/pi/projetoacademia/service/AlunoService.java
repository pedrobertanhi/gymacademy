package com.pi.projetoacademia.service;

import com.pi.projetoacademia.dto.AlunoRequestDTO;
import com.pi.projetoacademia.dto.AlunoResponseDTO;
import com.pi.projetoacademia.repository.AlunoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AlunoService {

    private final AlunoRepository alunoRepository;

    public List<AlunoResponseDTO> listar() {
        // TODO: buscar todos os alunos e mapear para AlunoResponseDTO (incluir flag planoVencido).
        throw new UnsupportedOperationException("TODO: implementar AlunoService.listar");
    }

    public AlunoResponseDTO buscarPorId(Long id) {
        // TODO: buscar por id, lançar 404 se não encontrado.
        throw new UnsupportedOperationException("TODO: implementar AlunoService.buscarPorId");
    }

    public List<AlunoResponseDTO> buscar(String termo) {
        // TODO: buscar por nome OU contato (LIKE), retornar lista de DTOs.
        throw new UnsupportedOperationException("TODO: implementar AlunoService.buscar");
    }

    public AlunoResponseDTO criar(AlunoRequestDTO request) {
        // TODO: validar email/cpf únicos, persistir Aluno, retornar DTO.
        throw new UnsupportedOperationException("TODO: implementar AlunoService.criar");
    }

    public AlunoResponseDTO atualizar(Long id, AlunoRequestDTO request) {
        // TODO: buscar aluno, atualizar campos, persistir, retornar DTO.
        throw new UnsupportedOperationException("TODO: implementar AlunoService.atualizar");
    }

    public void deletar(Long id) {
        // TODO: deletar aluno por id (ou soft-delete: setar ativo=false).
        throw new UnsupportedOperationException("TODO: implementar AlunoService.deletar");
    }

    public long contarAtivos() {
        // TODO: contar alunos ativos para o badge de "Lotação Atual" no dashboard.
        throw new UnsupportedOperationException("TODO: implementar AlunoService.contarAtivos");
    }
}
