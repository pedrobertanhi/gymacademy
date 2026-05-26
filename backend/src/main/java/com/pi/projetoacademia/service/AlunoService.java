package com.pi.projetoacademia.service;

import com.pi.projetoacademia.dto.AlunoRequestDTO;
import com.pi.projetoacademia.dto.AlunoResponseDTO;
import com.pi.projetoacademia.model.Aluno;
import com.pi.projetoacademia.repository.AlunoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AlunoService {

    private final AlunoRepository alunoRepository;
    private final PasswordEncoder passwordEncoder;

    public List<AlunoResponseDTO> listar() {
        return alunoRepository.findAll().stream()
                .map(a -> new AlunoResponseDTO(
                        a.getId(),
                        a.getNome(),
                        a.getEmail(),
                        a.getContato(),
                        a.getCpf(),
                        a.getGenero(),
                        a.getPlanoInicio(),
                        a.getPlanoFim(),
                        a.isAtivo(),
                        false))
                .toList();
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
        if (alunoRepository.findByEmail(request.email()).isPresent()) {
            throw new IllegalArgumentException("E-mail já cadastrado");
        }

        Aluno aluno = new Aluno();
        aluno.setNome(request.nome());
        aluno.setEmail(request.email());
        aluno.setContato(request.contato());
        aluno.setCpf(request.cpf());
        aluno.setGenero(request.genero());
        aluno.setSenha(passwordEncoder.encode(request.senha()));
        aluno.setPlanoInicio(request.planoInicio() != null ? request.planoInicio() : LocalDate.now());
        aluno.setPlanoFim(request.planoFim() != null ? request.planoFim() : LocalDate.now().plusMonths(1));
        aluno.setAtivo(true);

        Aluno salvo = alunoRepository.save(aluno);

        return new AlunoResponseDTO(
                salvo.getId(),
                salvo.getNome(),
                salvo.getEmail(),
                salvo.getContato(),
                salvo.getCpf(),
                salvo.getGenero(),
                salvo.getPlanoInicio(),
                salvo.getPlanoFim(),
                salvo.isAtivo(),
                false
        );
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
