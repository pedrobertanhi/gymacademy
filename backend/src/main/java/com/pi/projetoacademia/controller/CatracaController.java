package com.pi.projetoacademia.controller;

import com.pi.projetoacademia.dto.AcessoResponseDTO;
import com.pi.projetoacademia.dto.AlunoResponseDTO;
import com.pi.projetoacademia.dto.CatracaResponseDTO;
import com.pi.projetoacademia.service.CatracaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/catraca")
@RequiredArgsConstructor
public class CatracaController {

    private final CatracaService catracaService;

    @PostMapping("/liberar/{alunoId}")
    public ResponseEntity<CatracaResponseDTO> liberar(@PathVariable Long alunoId, @RequestParam boolean aprovado) {
        return ResponseEntity.ok(catracaService.liberar(alunoId, aprovado));
    }

    @PostMapping("/solicitar/{alunoId}")
    public ResponseEntity<Void> solicitar(@PathVariable Long alunoId) {
        catracaService.solicitarAcesso(alunoId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/pendente")
    public ResponseEntity<AlunoResponseDTO> pendente() {
        AlunoResponseDTO proximo = catracaService.buscarProximoPendente();
        if (proximo == null) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(proximo);
    }

    @GetMapping("/recentes")
    public ResponseEntity<List<AcessoResponseDTO>> recentes() {
        return ResponseEntity.ok(catracaService.listarRecentes());
    }
}
