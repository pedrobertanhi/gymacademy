package com.academia.gymacademy.controller;

import com.academia.gymacademy.dto.request.AlterarSenhaRequest;
import com.academia.gymacademy.dto.request.AtualizarAlunoRequest;
import com.academia.gymacademy.dto.request.RenovarPlanoRequest;
import com.academia.gymacademy.dto.response.ApiResponse;
import com.academia.gymacademy.dto.response.AlunoResponse;
import com.academia.gymacademy.dto.response.RenovacaoResponse;
import com.academia.gymacademy.enums.Role;
import com.academia.gymacademy.model.Aluno;
import com.academia.gymacademy.service.AlunoService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/alunos")
public class AlunoController {

    @Autowired private AlunoService alunoService;

    /** GET /api/alunos?page=0&size=10&q=joao */
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','RECEPCIONISTA')")
    public ResponseEntity<ApiResponse<Page<AlunoResponse>>> listar(
            @RequestParam(defaultValue = "") String q,
            @RequestParam(defaultValue = "0")  int page,
            @RequestParam(defaultValue = "10") int size) {

        Page<AlunoResponse> resultado = alunoService.buscar(q,
                PageRequest.of(page, size, Sort.by("nome")));
        return ResponseEntity.ok(ApiResponse.ok("Alunos encontrados.", resultado));
    }

    /** GET /api/alunos/me — Aluno consultando seus próprios dados */
    @GetMapping("/me")
    public ResponseEntity<ApiResponse<AlunoResponse>> meuPerfil(
            @AuthenticationPrincipal Aluno aluno) {
        return ResponseEntity.ok(ApiResponse.ok("Perfil carregado.", AlunoResponse.from(aluno)));
    }

    /** GET /api/alunos/{id} */
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','RECEPCIONISTA')")
    public ResponseEntity<ApiResponse<AlunoResponse>> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok("Aluno encontrado.", alunoService.buscarPorId(id)));
    }

    /** PUT /api/alunos/{id} */
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<AlunoResponse>> atualizar(
            @PathVariable Long id,
            @Valid @RequestBody AtualizarAlunoRequest req,
            @AuthenticationPrincipal Aluno autenticado) {

        // Aluno só pode editar a si mesmo; admin pode editar qualquer um
        if (!autenticado.getId().equals(id) && autenticado.getRole() == Role.ALUNO) {
            return ResponseEntity.status(403).body(ApiResponse.erro("Sem permissão."));
        }
        return ResponseEntity.ok(ApiResponse.ok("Dados atualizados.", alunoService.atualizar(id, req)));
    }

    /** PATCH /api/alunos/{id}/senha */
    @PatchMapping("/{id}/senha")
    public ResponseEntity<ApiResponse<Void>> alterarSenha(
            @PathVariable Long id,
            @Valid @RequestBody AlterarSenhaRequest req,
            @AuthenticationPrincipal Aluno autenticado) {

        if (!autenticado.getId().equals(id)) {
            return ResponseEntity.status(403).body(ApiResponse.erro("Sem permissão."));
        }
        alunoService.alterarSenha(id, req);
        return ResponseEntity.ok(ApiResponse.ok("Senha alterada com sucesso."));
    }

    /** PATCH /api/alunos/{id}/status?ativo=false — Admin/Recepcionista */
    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ADMIN','RECEPCIONISTA')")
    public ResponseEntity<ApiResponse<AlunoResponse>> alterarStatus(
            @PathVariable Long id, @RequestParam boolean ativo) {
        return ResponseEntity.ok(ApiResponse.ok(
                ativo ? "Aluno ativado." : "Aluno desativado.",
                alunoService.alterarStatus(id, ativo)));
    }

    /** POST /api/alunos/{id}/renovar — Admin/Recepcionista */
    @PostMapping("/{id}/renovar")
    @PreAuthorize("hasAnyRole('ADMIN','RECEPCIONISTA')")
    public ResponseEntity<ApiResponse<RenovacaoResponse>> renovar(
            @PathVariable Long id,
            @Valid @RequestBody RenovarPlanoRequest req,
            @AuthenticationPrincipal Aluno autenticado) {

        RenovacaoResponse resp = alunoService.renovarPlano(id, req, autenticado.getEmail());
        return ResponseEntity.ok(ApiResponse.ok("Plano renovado com sucesso!", resp));
    }

    /** GET /api/alunos/{id}/renovacoes */
    @GetMapping("/{id}/renovacoes")
    @PreAuthorize("hasAnyRole('ADMIN','RECEPCIONISTA')")
    public ResponseEntity<ApiResponse<List<RenovacaoResponse>>> historico(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok("Histórico de renovações.", alunoService.historicoRenovacoes(id)));
    }

    /** PATCH /api/alunos/{id}/role?role=RECEPCIONISTA — Somente ADMIN */
    @PatchMapping("/{id}/role")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<AlunoResponse>> promoverRole(
            @PathVariable Long id, @RequestParam Role role) {
        return ResponseEntity.ok(ApiResponse.ok("Role atualizada.", alunoService.promoverRole(id, role)));
    }
}
