package com.pi.projetoacademia.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalTime;

@Entity
@Table(name = "aulas")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Aula {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String nome;

    @Column(length = 100)
    private String professor;

    @Column(length = 20)
    private String dia;

    @Column(name = "horario_inicio")
    private LocalTime horarioInicio;

    @Column(name = "horario_fim")
    private LocalTime horarioFim;

    @Column(nullable = false)
    private Integer capacidade = 20;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private StatusAula status = StatusAula.ABERTA;

    @Column(length = 100)
    private String imagem;

    public enum StatusAula {
        ABERTA, CHEIA, CANCELADA
    }
}
