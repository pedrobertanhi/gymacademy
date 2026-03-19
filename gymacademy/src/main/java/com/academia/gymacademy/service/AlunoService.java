package com.academia.gymacademy.service;

import com.academia.gymacademy.dto.CadastroAlunoRequest;
import com.academia.gymacademy.model.Aluno;
import com.academia.gymacademy.repository.AlunoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class AlunoService {

    @Autowired
    private AlunoRepository alunoRepository;

    // ==================== CADASTRAR ALUNO ====================

    /**
     * Cadastra um novo aluno.
     * Regra: E-mail não pode ser duplicado no sistema.
     */
    public Aluno cadastrar(CadastroAlunoRequest request) {
        if (alunoRepository.existsByEmail(request.getEmail())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "Já existe um aluno cadastrado com o e-mail: " + request.getEmail());
        }

        Aluno novoAluno = new Aluno(
                request.getNome(),
                request.getEmail(),
                request.getSenha(),
                LocalDate.now(),           // dataInicio = hoje
                request.getDataFimPlano()
        );

        return alunoRepository.save(novoAluno);
    }

    // ==================== LOGIN ====================

    /**
     * Autentica o aluno pelo e-mail e senha.
     * Retorna o aluno se credenciais forem válidas.
     */
    public Aluno login(String email, String senha) {
        return alunoRepository.findByEmailAndSenha(email, senha)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED,
                        "E-mail ou senha incorretos."));
    }

    // ==================== BUSCAR TODOS ====================

    public List<Aluno> listarTodos() {
        return alunoRepository.findAll();
    }

    // ==================== BUSCAR POR EMAIL ====================

    public Aluno buscarPorEmail(String email) {
        return alunoRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Aluno não encontrado com o e-mail: " + email));
    }

    // ==================== BUSCAR POR ID ====================

    public Aluno buscarPorId(Long id) {
        return alunoRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Aluno não encontrado com o ID: " + id));
    }
}
