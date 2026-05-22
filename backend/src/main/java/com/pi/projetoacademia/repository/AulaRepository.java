package com.pi.projetoacademia.repository;

import com.pi.projetoacademia.model.Aula;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AulaRepository extends JpaRepository<Aula, Long> {

    List<Aula> findByStatus(Aula.StatusAula status);

    List<Aula> findByDia(String dia);
}
