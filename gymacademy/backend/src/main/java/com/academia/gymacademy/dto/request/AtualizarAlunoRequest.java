package com.academia.gymacademy.dto.request;

import com.academia.gymacademy.enums.TipoPlano;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

// ============================================================
//  Atualização de dados do Aluno
// ============================================================
public class AtualizarAlunoRequest {

    @Size(min = 2, max = 100)
    private String nome;

    private String telefone;

    private String fotoPerfil;

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
    public String getTelefone() { return telefone; }
    public void setTelefone(String telefone) { this.telefone = telefone; }
    public String getFotoPerfil() { return fotoPerfil; }
    public void setFotoPerfil(String fotoPerfil) { this.fotoPerfil = fotoPerfil; }
}
