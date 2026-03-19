package com.academia.gymacademy.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public class CadastroAlunoRequest {

    @NotBlank(message = "O nome é obrigatório.")
    private String nome;

    @NotBlank(message = "O e-mail é obrigatório.")
    @Email(message = "Formato de e-mail inválido.")
    private String email;

    @NotBlank(message = "A senha é obrigatória.")
    private String senha;

    @NotNull(message = "A data de fim do plano é obrigatória.")
    private LocalDate dataFimPlano;

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getSenha() { return senha; }
    public void setSenha(String senha) { this.senha = senha; }

    public LocalDate getDataFimPlano() { return dataFimPlano; }
    public void setDataFimPlano(LocalDate dataFimPlano) { this.dataFimPlano = dataFimPlano; }
}
