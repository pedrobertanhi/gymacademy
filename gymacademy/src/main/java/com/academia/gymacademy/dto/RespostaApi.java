package com.academia.gymacademy.dto;

public class RespostaApi {

    private boolean sucesso;
    private String mensagem;
    private Object dados;

    public RespostaApi(boolean sucesso, String mensagem) {
        this.sucesso = sucesso;
        this.mensagem = mensagem;
    }

    public RespostaApi(boolean sucesso, String mensagem, Object dados) {
        this.sucesso = sucesso;
        this.mensagem = mensagem;
        this.dados = dados;
    }

    public boolean isSucesso() { return sucesso; }
    public String getMensagem() { return mensagem; }
    public Object getDados() { return dados; }
}
