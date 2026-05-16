package com.pi.projetoacademia.repository;

import com.pi.projetoacademia.model.Acesso;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AcessoRepository extends JpaRepository<Acesso, Long> {

    List<Acesso> findByAlunoId(Long alunoId);

    List<Acesso> findByMomentoBetween(LocalDateTime inicio, LocalDateTime fim);
}
