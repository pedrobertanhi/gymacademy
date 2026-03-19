package com.academia.gymacademy.model;

import com.academia.gymacademy.enums.StatusAcesso;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "acessos", indexes = {
    @Index(name = "idx_acesso_aluno", columnList = "aluno_id"),
    @Index(name = "idx_acesso_data",  columnList = "dataHoraAcesso")
})
public class Acesso {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "aluno_id", nullable = false)
    private Aluno aluno;

    @Column(nullable = false)
    private LocalDateTime dataHoraAcesso;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatusAcesso status;

    // Observação opcional (ex: "Catraca 1", "Entrada Principal")
    private String observacao;

    // ===== CONSTRUTORES =====

    public Acesso() {}

    public Acesso(Aluno aluno, StatusAcesso status) {
        this.aluno = aluno;
        this.status = status;
        this.dataHoraAcesso = LocalDateTime.now();
    }

    public Acesso(Aluno aluno, StatusAcesso status, String observacao) {
        this(aluno, status);
        this.observacao = observacao;
    }

    // ===== GETTERS E SETTERS =====

    public Long getId() { return id; }
    public Aluno getAluno() { return aluno; }
    public LocalDateTime getDataHoraAcesso() { return dataHoraAcesso; }
    public StatusAcesso getStatus() { return status; }
    public String getObservacao() { return observacao; }

    public void setObservacao(String observacao) { this.observacao = observacao; }
}
