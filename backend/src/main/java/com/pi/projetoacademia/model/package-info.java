/**
 * Entidades JPA — tabelas do banco.
 *
 * Convenção: classes anotadas com {@code @Entity} e mapeadas com
 * {@code @Table(name = "...")}.
 *
 * Entidades esperadas:
 *   - Aluno (id, nome, email, contato, cpf, genero, planoInicio, planoFim, ativo)
 *   - Admin (id, nome, email, senha, contato, genero)
 *   - Aula (id, nome, professor, dia, horario, capacidade, status)
 *   - Acesso (id, aluno, momento) — log de catraca
 */
package com.pi.projetoacademia.model;
