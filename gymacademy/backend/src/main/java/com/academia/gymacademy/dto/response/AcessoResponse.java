package com.academia.gymacademy.dto.response;

import com.academia.gymacademy.enums.StatusAcesso;
import com.academia.gymacademy.model.Acesso;

import java.time.LocalDateTime;

public class AcessoResponse {

    private Long id;
    private Long alunoId;
    private String alunoNome;
    private String alunoEmail;
    private LocalDateTime dataHoraAcesso;
    private StatusAcesso status;
    private String observacao;

    public static AcessoResponse from(Acesso a) {
        AcessoResponse r = new AcessoResponse();
        r.id             = a.getId();
        r.alunoId        = a.getAluno().getId();
        r.alunoNome      = a.getAluno().getNome();
        r.alunoEmail     = a.getAluno().getEmail();
        r.dataHoraAcesso = a.getDataHoraAcesso();
        r.status         = a.getStatus();
        r.observacao     = a.getObservacao();
        return r;
    }

    public Long getId()                      { return id; }
    public Long getAlunoId()                 { return alunoId; }
    public String getAlunoNome()             { return alunoNome; }
    public String getAlunoEmail()            { return alunoEmail; }
    public LocalDateTime getDataHoraAcesso() { return dataHoraAcesso; }
    public StatusAcesso getStatus()          { return status; }
    public String getObservacao()            { return observacao; }
}
