package com.academia.gymacademy.service;

import com.academia.gymacademy.model.Acesso;
import com.academia.gymacademy.model.Acesso.StatusAcesso;
import com.academia.gymacademy.model.Aluno;
import com.academia.gymacademy.repository.AcessoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class AcessoService {

    @Autowired
    private AcessoRepository acessoRepository;

    @Autowired
    private AlunoService alunoService;

    // ==================== LIBERAR CATRACA ====================

    /**
     * Regra de Negócio Principal:
     * 1. Busca o aluno pelo e-mail (404 se não encontrar).
     * 2. Verifica se o plano está ativo.
     *    - Se SIM → registra acesso LIBERADO e retorna o acesso.
     *    - Se NÃO → registra acesso BLOQUEADO e lança exceção 403.
     */
    public Acesso liberarAcesso(String email) {
        // Passo 1: Buscar o aluno (AlunoService já trata 404)
        Aluno aluno = alunoService.buscarPorEmail(email);

        // Passo 2: Verificar a regra de negócio do plano
        StatusAcesso status = aluno.isPlanoAtivo() ? StatusAcesso.LIBERADO : StatusAcesso.BLOQUEADO;

        // Passo 3: Registrar o acesso no banco de dados (histórico)
        Acesso acesso = new Acesso(aluno, status);
        acessoRepository.save(acesso);

        // Passo 4: Responder conforme o resultado
        if (status == StatusAcesso.BLOQUEADO) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                    "Plano vencido em: " + aluno.getDataFimPlano() + ". Procure a recepção.");
        }

        return acesso;
    }

    // ==================== HISTÓRICO DE ACESSOS ====================

    /**
     * Retorna o histórico de acessos de um aluno específico.
     */
    public List<Acesso> historicoDoAluno(Long alunoId) {
        // Verifica se o aluno existe antes de buscar
        alunoService.buscarPorId(alunoId);
        return acessoRepository.findByAlunoIdOrderByDataHoraAcessoDesc(alunoId);
    }

    /**
     * Retorna todos os acessos do sistema (útil para administração).
     */
    public List<Acesso> listarTodos() {
        return acessoRepository.findAll();
    }
}
