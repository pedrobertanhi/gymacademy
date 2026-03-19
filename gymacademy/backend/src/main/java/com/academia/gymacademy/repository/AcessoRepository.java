package com.academia.gymacademy.repository;

import com.academia.gymacademy.enums.StatusAcesso;
import com.academia.gymacademy.model.Acesso;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AcessoRepository extends JpaRepository<Acesso, Long> {

    Page<Acesso> findByAlunoIdOrderByDataHoraAcessoDesc(Long alunoId, Pageable pageable);

    List<Acesso> findTop10ByOrderByDataHoraAcessoDesc();

    @Query("SELECT COUNT(a) FROM Acesso a WHERE a.dataHoraAcesso BETWEEN :inicio AND :fim")
    long countByPeriodo(@Param("inicio") LocalDateTime inicio, @Param("fim") LocalDateTime fim);

    @Query("SELECT COUNT(a) FROM Acesso a WHERE a.status = :status AND a.dataHoraAcesso BETWEEN :inicio AND :fim")
    long countByStatusAndPeriodo(@Param("status") StatusAcesso status,
                                  @Param("inicio") LocalDateTime inicio,
                                  @Param("fim") LocalDateTime fim);

    // Total de acessos de hoje
    @Query("SELECT COUNT(a) FROM Acesso a WHERE a.dataHoraAcesso >= :inicioDia")
    long countAcessosHoje(@Param("inicioDia") LocalDateTime inicioDia);
}
