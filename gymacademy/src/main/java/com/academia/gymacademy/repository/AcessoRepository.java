package com.academia.gymacademy.repository;

import com.academia.gymacademy.model.Acesso;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AcessoRepository extends JpaRepository<Acesso, Long> {

    /**
     * Busca todos os acessos de um aluno específico pelo ID do aluno.
     */
    List<Acesso> findByAlunoIdOrderByDataHoraAcessoDesc(Long alunoId);
}
