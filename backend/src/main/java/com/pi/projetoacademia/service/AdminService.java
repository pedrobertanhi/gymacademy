package com.pi.projetoacademia.service;

import com.pi.projetoacademia.dto.AdminRequestDTO;
import com.pi.projetoacademia.dto.LoginRequestDTO;
import com.pi.projetoacademia.dto.LoginResponseDTO;
import com.pi.projetoacademia.repository.AdminRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final AdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder;

    public LoginResponseDTO autenticar(LoginRequestDTO request) {
        // TODO: buscar admin por email, validar senha com passwordEncoder.matches(),
        //       gerar token (JWT ou opaque) e retornar LoginResponseDTO.
        throw new UnsupportedOperationException("TODO: implementar AdminService.autenticar");
    }

    public LoginResponseDTO cadastrar(AdminRequestDTO request) {
        // TODO: validar email único, codificar senha com passwordEncoder.encode(),
        //       persistir Admin e retornar LoginResponseDTO.
        throw new UnsupportedOperationException("TODO: implementar AdminService.cadastrar");
    }

    public void redefinirSenha(String email, String novaSenha) {
        // TODO: buscar admin, codificar nova senha, salvar.
        throw new UnsupportedOperationException("TODO: implementar AdminService.redefinirSenha");
    }
}
