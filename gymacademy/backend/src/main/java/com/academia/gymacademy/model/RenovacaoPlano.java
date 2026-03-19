package com.academia.gymacademy.model;

import com.academia.gymacademy.enums.TipoPlano;
import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "renovacoes_plano")
public class RenovacaoPlano {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "aluno_id", nullable = false)
    private Aluno aluno;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoPlano tipoPlano;

    @Column(nullable = false)
    private LocalDate dataInicio;

    @Column(nullable = false)
    private LocalDate dataFim;

    @Column(nullable = false)
    private Double valorPago;

    @Column(nullable = false, updatable = false)
    private LocalDateTime realizadaEm;

    // Quem realizou a renovação (email do admin/recepcionista)
    private String realizadaPor;

    @PrePersist
    protected void onCreate() {
        this.realizadaEm = LocalDateTime.now();
    }

    // ===== CONSTRUTORES =====

    public RenovacaoPlano() {}

    public RenovacaoPlano(Aluno aluno, TipoPlano tipoPlano, LocalDate dataInicio,
                          LocalDate dataFim, Double valorPago, String realizadaPor) {
        this.aluno = aluno;
        this.tipoPlano = tipoPlano;
        this.dataInicio = dataInicio;
        this.dataFim = dataFim;
        this.valorPago = valorPago;
        this.realizadaPor = realizadaPor;
    }

    // ===== GETTERS =====

    public Long getId() { return id; }
    public Aluno getAluno() { return aluno; }
    public TipoPlano getTipoPlano() { return tipoPlano; }
    public LocalDate getDataInicio() { return dataInicio; }
    public LocalDate getDataFim() { return dataFim; }
    public Double getValorPago() { return valorPago; }
    public LocalDateTime getRealizadaEm() { return realizadaEm; }
    public String getRealizadaPor() { return realizadaPor; }
}
