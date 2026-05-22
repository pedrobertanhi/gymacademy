package com.pi.projetoacademia.controller;

import com.pi.projetoacademia.dto.AlunoRequestDTO;
import com.pi.projetoacademia.dto.AlunoResponseDTO;
import com.pi.projetoacademia.service.AlunoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/alunos")
@RequiredArgsConstructor
public class AlunoController {

    private final AlunoService alunoService;

    @GetMapping
    public ResponseEntity<List<AlunoResponseDTO>> listar() {
        return ResponseEntity.ok(alunoService.listar());
    }

    @GetMapping("/buscar")
    public ResponseEntity<List<AlunoResponseDTO>> buscar(@RequestParam String q) {
        return ResponseEntity.ok(alunoService.buscar(q));
    }

    @GetMapping("/ativos/contagem")
    public ResponseEntity<Map<String, Long>> contarAtivos() {
        return ResponseEntity.ok(Map.of("ativos", alunoService.contarAtivos()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<AlunoResponseDTO> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(alunoService.buscarPorId(id));
    }

    @PostMapping
    public ResponseEntity<AlunoResponseDTO> criar(@RequestBody AlunoRequestDTO body) {
        AlunoResponseDTO criado = alunoService.criar(body);
        return ResponseEntity.created(URI.create("/api/alunos/" + criado.id())).body(criado);
    }

    @PutMapping("/{id}")
    public ResponseEntity<AlunoResponseDTO> atualizar(@PathVariable Long id, @RequestBody AlunoRequestDTO body) {
        return ResponseEntity.ok(alunoService.atualizar(id, body));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        alunoService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
