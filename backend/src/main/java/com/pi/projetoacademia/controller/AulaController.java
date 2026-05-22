package com.pi.projetoacademia.controller;

import com.pi.projetoacademia.dto.AulaRequestDTO;
import com.pi.projetoacademia.dto.AulaResponseDTO;
import com.pi.projetoacademia.service.AulaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/aulas")
@RequiredArgsConstructor
public class AulaController {

    private final AulaService aulaService;

    @GetMapping
    public ResponseEntity<List<AulaResponseDTO>> listar() {
        return ResponseEntity.ok(aulaService.listar());
    }

    @GetMapping("/{id}")
    public ResponseEntity<AulaResponseDTO> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(aulaService.buscarPorId(id));
    }

    @PostMapping
    public ResponseEntity<AulaResponseDTO> criar(@RequestBody AulaRequestDTO body) {
        AulaResponseDTO criada = aulaService.criar(body);
        return ResponseEntity.created(URI.create("/api/aulas/" + criada.id())).body(criada);
    }

    @PutMapping("/{id}")
    public ResponseEntity<AulaResponseDTO> atualizar(@PathVariable Long id, @RequestBody AulaRequestDTO body) {
        return ResponseEntity.ok(aulaService.atualizar(id, body));
    }

    @PostMapping("/{id}/cancelar")
    public ResponseEntity<Void> cancelar(@PathVariable Long id) {
        aulaService.cancelar(id);
        return ResponseEntity.noContent().build();
    }
}
