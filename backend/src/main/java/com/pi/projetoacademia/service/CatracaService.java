package com.pi.projetoacademia.service;

import com.pi.projetoacademia.dto.AcessoResponseDTO;
import com.pi.projetoacademia.dto.AlunoResponseDTO;
import com.pi.projetoacademia.dto.CatracaResponseDTO;
import com.pi.projetoacademia.model.Acesso;
import com.pi.projetoacademia.model.Aluno;
import com.pi.projetoacademia.repository.AcessoRepository;
import com.pi.projetoacademia.repository.AlunoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CatracaService {

    private final AcessoRepository acessoRepository;
    private final AlunoRepository alunoRepository;

    private final java.util.Queue<Long> filaSolicitacoes = new java.util.concurrent.ConcurrentLinkedQueue<>();

    public CatracaResponseDTO liberar(Long alunoId, boolean aprovado) {
        Aluno aluno = alunoRepository.findById(alunoId)
                .orElseThrow(() -> new IllegalArgumentException("Aluno não encontrado"));

        boolean liberado;
        String motivo;

        if (!aprovado) {
            liberado = false;
            motivo = "Bloqueado manualmente";
        } else {
            liberado = true;
            motivo = "OK";

            if (!aluno.isAtivo()) {
                liberado = false;
                motivo = "aluno inativo";
            } else if (aluno.getPlanoFim() != null && LocalDate.now().isAfter(aluno.getPlanoFim())) {
                liberado = false;
                motivo = "plano vencido";
            }
        }

        Acesso acesso = new Acesso();
        acesso.setAluno(aluno);
        acesso.setMomento(LocalDateTime.now());
        acesso.setLiberado(liberado);
        acesso.setMotivo(motivo);
        acessoRepository.save(acesso);

        return new CatracaResponseDTO(
                liberado,
                motivo,
                aluno.getId(),
                aluno.getNome(),
                acesso.getMomento()
        );
    }

    public void solicitarAcesso(Long alunoId) {
        filaSolicitacoes.add(alunoId);
    }

    public AlunoResponseDTO buscarProximoPendente() {
        Long alunoId = filaSolicitacoes.poll();
        if (alunoId == null) {
            return null;
        }
        Aluno aluno = alunoRepository.findById(alunoId)
                .orElseThrow(() -> new IllegalArgumentException("Aluno não encontrado"));

        boolean planoVencido = aluno.getPlanoFim() != null && LocalDate.now().isAfter(aluno.getPlanoFim());

        return new AlunoResponseDTO(
                aluno.getId(),
                aluno.getNome(),
                aluno.getEmail(),
                aluno.getContato(),
                aluno.getCpf(),
                aluno.getGenero(),
                aluno.getPlanoInicio(),
                aluno.getPlanoFim(),
                aluno.isAtivo(),
                planoVencido
        );
    }

    public List<AcessoResponseDTO> listarRecentes() {
        return acessoRepository.findTop10ByOrderByMomentoDesc().stream()
                .map(a -> new AcessoResponseDTO(
                        a.getAluno() != null ? a.getAluno().getNome() : null,
                        a.getMomento(),
                        a.isLiberado(),
                        a.getMotivo()
                ))
                .toList();
    }
}
