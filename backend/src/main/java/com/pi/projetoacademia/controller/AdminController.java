package com.pi.projetoacademia.controller;

import com.pi.projetoacademia.dto.AdminRequestDTO;
import com.pi.projetoacademia.dto.LoginRequestDTO;
import com.pi.projetoacademia.dto.LoginResponseDTO;
import com.pi.projetoacademia.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;


@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(@RequestBody LoginRequestDTO body) {
        return ResponseEntity.ok(adminService.autenticar(body));
    }

    @PostMapping
    public ResponseEntity<LoginResponseDTO> cadastrar(@RequestBody AdminRequestDTO body) {
        return ResponseEntity.ok(adminService.cadastrar(body));
    }

    @PostMapping("/redefinir-senha")
    public ResponseEntity<Void> redefinirSenha( @RequestBody Map<String, String> body) {
        adminService.redefinirSenha(body.get("email"), body.get("novaSenha"));
        return ResponseEntity.noContent().build();
    }
}
