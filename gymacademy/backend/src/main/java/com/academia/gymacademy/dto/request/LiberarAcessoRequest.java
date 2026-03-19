package com.academia.gymacademy.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class LiberarAcessoRequest {

    @NotBlank(message = "E-mail é obrigatório")
    @Email(message = "Formato de e-mail inválido")
    private String email;

    private String observacao;

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getObservacao() { return observacao; }
    public void setObservacao(String observacao) { this.observacao = observacao; }
}
