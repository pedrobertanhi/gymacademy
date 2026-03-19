package com.academia.gymacademy.dto.response;

import com.academia.gymacademy.enums.Role;
import com.academia.gymacademy.enums.TipoPlano;
import com.academia.gymacademy.model.Aluno;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class AlunoResponse {

    private Long id;
    private String nome;
    private String email;
    private String cpf;
    private String telefone;
    private String fotoPerfil;
    private LocalDate dataInicio;
    private LocalDate dataFimPlano;
    private TipoPlano tipoPlano;
    private Role role;
    private boolean ativo;
    private boolean planoAtivo;
    private long diasRestantes;
    private LocalDateTime criadoEm;

    public static AlunoResponse from(Aluno aluno) {
        AlunoResponse r = new AlunoResponse();
        r.id            = aluno.getId();
        r.nome          = aluno.getNome();
        r.email         = aluno.getEmail();
        r.cpf           = aluno.getCpf();
        r.telefone      = aluno.getTelefone();
        r.fotoPerfil    = aluno.getFotoPerfil();
        r.dataInicio    = aluno.getDataInicio();
        r.dataFimPlano  = aluno.getDataFimPlano();
        r.tipoPlano     = aluno.getTipoPlano();
        r.role          = aluno.getRole();
        r.ativo         = aluno.isAtivo();
        r.planoAtivo    = aluno.isPlanoAtivo();
        r.diasRestantes = aluno.diasRestantesPlano();
        r.criadoEm      = aluno.getCriadoEm();
        return r;
    }

    // Getters
    public Long getId()                  { return id; }
    public String getNome()              { return nome; }
    public String getEmail()             { return email; }
    public String getCpf()               { return cpf; }
    public String getTelefone()          { return telefone; }
    public String getFotoPerfil()        { return fotoPerfil; }
    public LocalDate getDataInicio()     { return dataInicio; }
    public LocalDate getDataFimPlano()   { return dataFimPlano; }
    public TipoPlano getTipoPlano()      { return tipoPlano; }
    public Role getRole()                { return role; }
    public boolean isAtivo()             { return ativo; }
    public boolean isPlanoAtivo()        { return planoAtivo; }
    public long getDiasRestantes()       { return diasRestantes; }
    public LocalDateTime getCriadoEm()   { return criadoEm; }
}
