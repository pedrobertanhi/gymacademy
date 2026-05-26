package com.pi.projetoacademia.service;

import com.pi.projetoacademia.dto.LoginRequestDTO;
import com.pi.projetoacademia.dto.LoginResponseDTO;
import com.pi.projetoacademia.model.Admin;
import com.pi.projetoacademia.model.Aluno;
import com.pi.projetoacademia.repository.AdminRepository;
import com.pi.projetoacademia.repository.AlunoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AdminRepository adminRepository;
    private final AlunoRepository alunoRepository;
    private final PasswordEncoder passwordEncoder;

    public LoginResponseDTO autenticar(LoginRequestDTO dto) {
        Optional<Admin> adminOpt = adminRepository.findByEmail(dto.email());
        if (adminOpt.isPresent()) {
            Admin admin = adminOpt.get();
            if (passwordEncoder.matches(dto.senha(), admin.getSenha())) {
                return new LoginResponseDTO(
                        admin.getId(),
                        admin.getNome(),
                        admin.getEmail(),
                        "token-simulado-admin-" + admin.getId(),
                        "ADMIN"
                );
            }
        }

        Optional<Aluno> alunoOpt = alunoRepository.findByEmail(dto.email());
        if (alunoOpt.isPresent()) {
            Aluno aluno = alunoOpt.get();
            if (passwordEncoder.matches(dto.senha(), aluno.getSenha())) {
                return new LoginResponseDTO(
                        aluno.getId(),
                        aluno.getNome(),
                        aluno.getEmail(),
                        "token-simulado-aluno-" + aluno.getId(),
                        "ALUNO"
                );
            }
        }

        throw new IllegalArgumentException("Credenciais inválidas");
    }
}
