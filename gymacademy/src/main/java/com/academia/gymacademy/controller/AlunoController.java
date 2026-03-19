package com.academia.gymacademy.controller;

import com.academia.gymacademy.dto.CadastroAlunoRequest;
import com.academia.gymacademy.dto.LoginRequest;
import com.academia.gymacademy.dto.RespostaApi;
import com.academia.gymacademy.model.Aluno;
import com.academia.gymacademy.service.AlunoService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/alunos")
@CrossOrigin(origins = "*") // Permite requisições do Front-end rodando em qualquer origem
public class AlunoController {

    @Autowired
    private AlunoService alunoService;

    // ==================== POST /alunos ====================
    // Cadastrar novo aluno

    @PostMapping
    public ResponseEntity<RespostaApi> cadastrar(@Valid @RequestBody CadastroAlunoRequest request) {
        Aluno alunoCadastrado = alunoService.cadastrar(request);

        RespostaApi resposta = new RespostaApi(
                true,
                "Aluno '" + alunoCadastrado.getNome() + "' cadastrado com sucesso!",
                Map.of(
                        "id", alunoCadastrado.getId(),
                        "nome", alunoCadastrado.getNome(),
                        "email", alunoCadastrado.getEmail(),
                        "dataFimPlano", alunoCadastrado.getDataFimPlano()
                )
        );

        return ResponseEntity.status(HttpStatus.CREATED).body(resposta);
    }

    // ==================== POST /alunos/login ====================
    // Autenticar aluno

    @PostMapping("/login")
    public ResponseEntity<RespostaApi> login(@Valid @RequestBody LoginRequest request) {
        Aluno aluno = alunoService.login(request.getEmail(), request.getSenha());

        RespostaApi resposta = new RespostaApi(
                true,
                "Login realizado com sucesso!",
                Map.of(
                        "id", aluno.getId(),
                        "nome", aluno.getNome(),
                        "email", aluno.getEmail(),
                        "planoAtivo", aluno.isPlanoAtivo(),
                        "dataFimPlano", aluno.getDataFimPlano()
                )
        );

        return ResponseEntity.ok(resposta);
    }

    // ==================== GET /alunos ====================
    // Listar todos os alunos (admin)

    @GetMapping
    public ResponseEntity<List<Aluno>> listarTodos() {
        return ResponseEntity.ok(alunoService.listarTodos());
    }

    // ==================== GET /alunos/{id} ====================
    // Buscar aluno por ID

    @GetMapping("/{id}")
    public ResponseEntity<Aluno> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(alunoService.buscarPorId(id));
    }
}
