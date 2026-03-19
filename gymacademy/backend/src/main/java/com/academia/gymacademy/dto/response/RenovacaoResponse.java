package com.academia.gymacademy.dto.response;

import com.academia.gymacademy.enums.TipoPlano;
import com.academia.gymacademy.model.RenovacaoPlano;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class RenovacaoResponse {

    private Long id;
    private Long alunoId;
    private String alunoNome;
    private TipoPlano tipoPlano;
    private LocalDate dataInicio;
    private LocalDate dataFim;
    private Double valorPago;
    private LocalDateTime realizadaEm;
    private String realizadaPor;

    public static RenovacaoResponse from(RenovacaoPlano r) {
        RenovacaoResponse dto = new RenovacaoResponse();
        dto.id           = r.getId();
        dto.alunoId      = r.getAluno().getId();
        dto.alunoNome    = r.getAluno().getNome();
        dto.tipoPlano    = r.getTipoPlano();
        dto.dataInicio   = r.getDataInicio();
        dto.dataFim      = r.getDataFim();
        dto.valorPago    = r.getValorPago();
        dto.realizadaEm  = r.getRealizadaEm();
        dto.realizadaPor = r.getRealizadaPor();
        return dto;
    }

    public Long getId()                    { return id; }
    public Long getAlunoId()               { return alunoId; }
    public String getAlunoNome()           { return alunoNome; }
    public TipoPlano getTipoPlano()        { return tipoPlano; }
    public LocalDate getDataInicio()       { return dataInicio; }
    public LocalDate getDataFim()          { return dataFim; }
    public Double getValorPago()           { return valorPago; }
    public LocalDateTime getRealizadaEm()  { return realizadaEm; }
    public String getRealizadaPor()        { return realizadaPor; }
}
