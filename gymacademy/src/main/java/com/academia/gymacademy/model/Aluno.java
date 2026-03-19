package com.academia.gymacademy.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "alunos")
public class Aluno {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "O nome é obrigatório.")
    @Column(nullable = false)
    private String nome;

    @NotBlank(message = "O e-mail é obrigatório.")
    @Email(message = "Formato de e-mail inválido.")
    @Column(nullable = false, unique = true)
    private String email;

    @NotBlank(message = "A senha é obrigatória.")
    @Column(nullable = false)
    private String senha;

    @NotNull(message = "A data de início do plano é obrigatória.")
    @Column(nullable = false)
    private LocalDate dataInicio;

    @NotNull(message = "A data de fim do plano é obrigatória.")
    @Column(nullable = false)
    private LocalDate dataFimPlano;

    // Relacionamento: Um Aluno tem muitos Acessos
    @OneToMany(mappedBy = "aluno", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Acesso> acessos;

    // ==================== CONSTRUTORES ====================

    public Aluno() {}

    public Aluno(String nome, String email, String senha, LocalDate dataInicio, LocalDate dataFimPlano) {
        this.nome = nome;
        this.email = email;
        this.senha = senha;
        this.dataInicio = dataInicio;
        this.dataFimPlano = dataFimPlano;
    }

    // ==================== GETTERS E SETTERS ====================

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getSenha() { return senha; }
    public void setSenha(String senha) { this.senha = senha; }

    public LocalDate getDataInicio() { return dataInicio; }
    public void setDataInicio(LocalDate dataInicio) { this.dataInicio = dataInicio; }

    public LocalDate getDataFimPlano() { return dataFimPlano; }
    public void setDataFimPlano(LocalDate dataFimPlano) { this.dataFimPlano = dataFimPlano; }

    public List<Acesso> getAcessos() { return acessos; }
    public void setAcessos(List<Acesso> acessos) { this.acessos = acessos; }

    // ==================== REGRA DE NEGÓCIO ====================

    /**
     * Verifica se o plano do aluno está ativo (data atual <= dataFimPlano).
     */
    public boolean isPlanoAtivo() {
        return !LocalDate.now().isAfter(this.dataFimPlano);
    }
}
