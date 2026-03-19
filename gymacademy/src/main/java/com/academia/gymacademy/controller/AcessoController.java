package com.academia.gymacademy.controller;

import com.academia.gymacademy.dto.LiberarAcessoRequest;
import com.academia.gymacademy.dto.RespostaApi;
import com.academia.gymacademy.model.Acesso;
import com.academia.gymacademy.service.AcessoService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/acessos")
@CrossOrigin(origins = "*") // Permite requisições do Front-end
public class AcessoController {

    @Autowired
    private AcessoService acessoService;

    // ==================== POST /acessos/liberar ====================
    // Endpoint principal da catraca
    //
    // Respostas possíveis:
    //   200 OK       → Plano ativo, acesso liberado
    //   403 FORBIDDEN → Plano vencido, acesso bloqueado
    //   404 NOT FOUND → Aluno não encontrado
    //
    // Nota: ResponseStatusException lançada no Service é propagada
    //       automaticamente pelo Spring como resposta HTTP correta.

    @PostMapping("/liberar")
    public ResponseEntity<RespostaApi> liberarCatraca(@Valid @RequestBody LiberarAcessoRequest request) {
        Acesso acesso = acessoService.liberarAcesso(request.getEmail());

        RespostaApi resposta = new RespostaApi(
                true,
                "Acesso LIBERADO. Bom treino!",
                Map.of(
                        "acessoId", acesso.getId(),
                        "status", acesso.getStatus(),
                        "dataHora", acesso.getDataHoraAcesso(),
                        "aluno", acesso.getAluno().getNome()
                )
        );

        return ResponseEntity.ok(resposta);
    }

    // ==================== GET /acessos/historico/{alunoId} ====================
    // Retorna o histórico de entradas de um aluno

    @GetMapping("/historico/{alunoId}")
    public ResponseEntity<List<Acesso>> historico(@PathVariable Long alunoId) {
        return ResponseEntity.ok(acessoService.historicoDoAluno(alunoId));
    }

    // ==================== GET /acessos ====================
    // Lista todos os acessos do sistema (painel administrativo)

    @GetMapping
    public ResponseEntity<List<Acesso>> listarTodos() {
        return ResponseEntity.ok(acessoService.listarTodos());
    }
}
