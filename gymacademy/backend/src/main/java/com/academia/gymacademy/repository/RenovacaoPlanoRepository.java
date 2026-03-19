package com.academia.gymacademy.repository;

import com.academia.gymacademy.model.RenovacaoPlano;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface RenovacaoPlanoRepository extends JpaRepository<RenovacaoPlano, Long> {

    List<RenovacaoPlano> findByAlunoIdOrderByRealizadaEmDesc(Long alunoId);

    @Query("SELECT SUM(r.valorPago) FROM RenovacaoPlano r WHERE r.realizadaEm BETWEEN :inicio AND :fim")
    Double somarReceitaPeriodo(@Param("inicio") LocalDateTime inicio, @Param("fim") LocalDateTime fim);
}
