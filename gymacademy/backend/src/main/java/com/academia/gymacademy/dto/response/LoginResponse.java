package com.academia.gymacademy.dto.response;

import com.academia.gymacademy.enums.Role;
import com.academia.gymacademy.enums.StatusAcesso;
import com.academia.gymacademy.enums.TipoPlano;
import com.academia.gymacademy.model.Acesso;

import java.time.LocalDate;
import java.time.LocalDateTime;

// ============================================================
//  Login Response
// ============================================================
public class LoginResponse {

    private String token;
    private String tipo = "Bearer";
    private AlunoResponse aluno;

    public LoginResponse(String token, AlunoResponse aluno) {
        this.token = token;
        this.aluno = aluno;
    }

    public String getToken()        { return token; }
    public String getTipo()         { return tipo; }
    public AlunoResponse getAluno() { return aluno; }
}
