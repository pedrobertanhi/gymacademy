package com.pi.projetoacademia.controller;

import com.pi.projetoacademia.dto.AgendamentoRequestDTO;
import com.pi.projetoacademia.service.AgendamentoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/agendamentos")
@RequiredArgsConstructor
public class AgendamentoController {

    private final AgendamentoService agendamentoService;

    @PostMapping
    public ResponseEntity<Map<String, Long>> agendar(@RequestBody AgendamentoRequestDTO body) {
        Long id = agendamentoService.agendar(body);
        return ResponseEntity.ok(Map.of("id", id));
    }

    @DeleteMapping
    public ResponseEntity<Void> cancelar(@RequestParam Long alunoId, @RequestParam Long aulaId) {
        agendamentoService.cancelar(alunoId, aulaId);
        return ResponseEntity.noContent().build();
    }
}
