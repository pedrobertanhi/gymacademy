/**
 * Services — regras de negócio.
 *
 * Validações, orquestração entre repositórios, regras como:
 *   - bloquear catraca se o plano do aluno está vencido;
 *   - bloquear agendamento de aula sem vagas / cancelada;
 *   - calcular lotação atual (alunos ativos).
 *
 * Convenção: classes terminadas em {@code Service}, anotadas com {@code @Service}.
 */
package com.pi.projetoacademia.service;
