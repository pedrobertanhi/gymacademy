package com.academia.gymacademy.repository;

import com.academia.gymacademy.model.Aluno;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface AlunoRepository extends JpaRepository<Aluno, Long> {

    Optional<Aluno> findByEmail(String email);

    boolean existsByEmail(String email);
    boolean existsByCpf(String cpf);

    Page<Aluno> findByAtivoTrue(Pageable pageable);

    // Busca por nome ou email (para o painel admin)
    @Query("SELECT a FROM Aluno a WHERE a.ativo = true AND " +
           "(LOWER(a.nome) LIKE LOWER(CONCAT('%', :termo, '%')) OR " +
           " LOWER(a.email) LIKE LOWER(CONCAT('%', :termo, '%')))")
    Page<Aluno> buscarPorTermo(@Param("termo") String termo, Pageable pageable);

    // Planos vencendo nos próximos N dias
    @Query("SELECT a FROM Aluno a WHERE a.ativo = true AND " +
           "a.dataFimPlano BETWEEN :hoje AND :limite")
    List<Aluno> findAlunosComPlanoVencendoEm(@Param("hoje") LocalDate hoje,
                                              @Param("limite") LocalDate limite);

    // Planos já vencidos
    @Query("SELECT a FROM Aluno a WHERE a.ativo = true AND a.dataFimPlano < :hoje")
    List<Aluno> findAlunosComPlanoVencido(@Param("hoje") LocalDate hoje);

    // Dashboard: totais
    long countByAtivoTrue();

    @Query("SELECT COUNT(a) FROM Aluno a WHERE a.ativo = true AND a.dataFimPlano >= :hoje")
    long countComPlanoAtivo(@Param("hoje") LocalDate hoje);

    @Query("SELECT COUNT(a) FROM Aluno a WHERE a.ativo = true AND a.dataFimPlano < :hoje")
    long countComPlanoVencido(@Param("hoje") LocalDate hoje);
}
