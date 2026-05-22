package com.pi.projetoacademia.controller;

import com.pi.projetoacademia.dto.CatracaResponseDTO;
import com.pi.projetoacademia.service.CatracaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/catraca")
@RequiredArgsConstructor
public class CatracaController {

    private final CatracaService catracaService;

    @PostMapping("/liberar/{alunoId}")
    public ResponseEntity<CatracaResponseDTO> liberar(@PathVariable Long alunoId) {
        return ResponseEntity.ok(catracaService.liberar(alunoId));
    }
}
