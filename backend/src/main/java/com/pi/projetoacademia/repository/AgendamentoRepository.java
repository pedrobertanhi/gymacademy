package com.pi.projetoacademia.repository;

import com.pi.projetoacademia.model.Agendamento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AgendamentoRepository extends JpaRepository<Agendamento, Long> {

    List<Agendamento> findByAlunoId(Long alunoId);

    List<Agendamento> findByAulaId(Long aulaId);

    long countByAulaId(Long aulaId);

    boolean existsByAlunoIdAndAulaId(Long alunoId, Long aulaId);

    void deleteByAlunoIdAndAulaId(Long alunoId, Long aulaId);
}
