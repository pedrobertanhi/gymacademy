package com.academia.gymacademy.controller;

import com.academia.gymacademy.dto.request.CadastroAlunoRequest;
import com.academia.gymacademy.dto.request.LoginRequest;
import com.academia.gymacademy.dto.response.ApiResponse;
import com.academia.gymacademy.dto.response.AlunoResponse;
import com.academia.gymacademy.dto.response.LoginResponse;
import com.academia.gymacademy.model.Aluno;
import com.academia.gymacademy.security.JwtUtil;
import com.academia.gymacademy.service.AlunoService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired private AuthenticationManager authManager;
    @Autowired private JwtUtil jwtUtil;
    @Autowired private AlunoService alunoService;

    /** POST /api/auth/cadastro */
    @PostMapping("/cadastro")
    public ResponseEntity<ApiResponse<AlunoResponse>> cadastrar(
            @Valid @RequestBody CadastroAlunoRequest req) {

        AlunoResponse aluno = alunoService.cadastrar(req);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Aluno cadastrado com sucesso!", aluno));
    }

    /** POST /api/auth/login */
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponse>> login(
            @Valid @RequestBody LoginRequest req) {

        try {
            Authentication auth = authManager.authenticate(
                    new UsernamePasswordAuthenticationToken(req.getEmail(), req.getSenha()));

            String token = jwtUtil.gerarToken(auth);
            Aluno aluno = (Aluno) auth.getPrincipal();
            LoginResponse resp = new LoginResponse(token, AlunoResponse.from(aluno));

            return ResponseEntity.ok(ApiResponse.ok("Login realizado com sucesso!", resp));

        } catch (BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.erro("E-mail ou senha incorretos."));
        }
    }
}
