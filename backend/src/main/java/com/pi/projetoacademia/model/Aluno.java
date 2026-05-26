package com.pi.projetoacademia.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "alunos")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Aluno {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 120)
    private String nome;

    @Column(nullable = false, unique = true, length = 150)
    private String email;

    @Column(length = 20)
    private String contato;

    @Column(unique = true, length = 14)
    private String cpf;

    @Column(length = 20)
    private String genero;

    @Column(name = "plano_inicio")
    private LocalDate planoInicio;

    @Column(name = "plano_fim")
    private LocalDate planoFim;

    @Column(nullable = false)
    private boolean ativo = true;

    @Column(nullable = false)
    private String senha;
}
