package com.academia.gymacademy.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;

import java.time.LocalDateTime;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiResponse<T> {

    private boolean sucesso;
    private String mensagem;
    private T dados;
    private LocalDateTime timestamp = LocalDateTime.now();

    private ApiResponse() {}

    public static <T> ApiResponse<T> ok(String mensagem, T dados) {
        ApiResponse<T> r = new ApiResponse<>();
        r.sucesso  = true;
        r.mensagem = mensagem;
        r.dados    = dados;
        return r;
    }

    public static <T> ApiResponse<T> ok(String mensagem) {
        return ok(mensagem, null);
    }

    public static <T> ApiResponse<T> erro(String mensagem) {
        ApiResponse<T> r = new ApiResponse<>();
        r.sucesso  = false;
        r.mensagem = mensagem;
        return r;
    }

    public boolean isSucesso()          { return sucesso; }
    public String getMensagem()         { return mensagem; }
    public T getDados()                 { return dados; }
    public LocalDateTime getTimestamp() { return timestamp; }
}
