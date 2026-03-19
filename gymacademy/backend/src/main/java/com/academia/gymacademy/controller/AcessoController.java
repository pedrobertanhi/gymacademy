package com.academia.gymacademy.controller;

import com.academia.gymacademy.dto.request.LiberarAcessoRequest;
import com.academia.gymacademy.dto.response.AcessoResponse;
import com.academia.gymacademy.dto.response.ApiResponse;
import com.academia.gymacademy.service.AcessoService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/acessos")
public class AcessoController {

    @Autowired private AcessoService acessoService;

    /**
     * POST /api/acessos/liberar
     * Endpoint principal da catraca.
     * Qualquer usuário autenticado pode chamar (recepcionista, aluno, admin).
     */
    @PostMapping("/liberar")
    public ResponseEntity<ApiResponse<AcessoResponse>> liberar(
            @Valid @RequestBody LiberarAcessoRequest req) {

        AcessoResponse resp = acessoService.liberarAcesso(req.getEmail(), req.getObservacao());
        return ResponseEntity.ok(ApiResponse.ok("Acesso LIBERADO. Bom treino!", resp));
    }

    /**
     * GET /api/acessos/ultimos
     * Feed dos 10 últimos acessos (dashboard em tempo real).
     */
    @GetMapping("/ultimos")
    @PreAuthorize("hasAnyRole('ADMIN','RECEPCIONISTA')")
    public ResponseEntity<ApiResponse<List<AcessoResponse>>> ultimos() {
        return ResponseEntity.ok(ApiResponse.ok("Últimos acessos.", acessoService.ultimosAcessos()));
    }

    /**
     * GET /api/acessos/historico/{alunoId}?page=0&size=20
     */
    @GetMapping("/historico/{alunoId}")
    @PreAuthorize("hasAnyRole('ADMIN','RECEPCIONISTA')")
    public ResponseEntity<ApiResponse<Page<AcessoResponse>>> historico(
            @PathVariable Long alunoId,
            @RequestParam(defaultValue = "0")  int page,
            @RequestParam(defaultValue = "20") int size) {

        Page<AcessoResponse> pag = acessoService.historicoDoAluno(alunoId,
                PageRequest.of(page, size, Sort.by("dataHoraAcesso").descending()));
        return ResponseEntity.ok(ApiResponse.ok("Histórico de acessos.", pag));
    }
}
