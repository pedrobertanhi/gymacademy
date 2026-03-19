package com.academia.gymacademy.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "acessos")
public class Acesso {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Data e hora exata da tentativa de entrada
    @Column(nullable = false)
    private LocalDateTime dataHoraAcesso;

    // Resultado: LIBERADO ou BLOQUEADO
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatusAcesso status;

    // Relacionamento: Muitos Acessos pertencem a um Aluno
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "aluno_id", nullable = false)
    private Aluno aluno;

    // ==================== ENUM DE STATUS ====================

    public enum StatusAcesso {
        LIBERADO,
        BLOQUEADO
    }

    // ==================== CONSTRUTORES ====================

    public Acesso() {}

    public Acesso(Aluno aluno, StatusAcesso status) {
        this.aluno = aluno;
        this.status = status;
        this.dataHoraAcesso = LocalDateTime.now();
    }

    // ==================== GETTERS E SETTERS ====================

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public LocalDateTime getDataHoraAcesso() { return dataHoraAcesso; }
    public void setDataHoraAcesso(LocalDateTime dataHoraAcesso) { this.dataHoraAcesso = dataHoraAcesso; }

    public StatusAcesso getStatus() { return status; }
    public void setStatus(StatusAcesso status) { this.status = status; }

    public Aluno getAluno() { return aluno; }
    public void setAluno(Aluno aluno) { this.aluno = aluno; }
}
