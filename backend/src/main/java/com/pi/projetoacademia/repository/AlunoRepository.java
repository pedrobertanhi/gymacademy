package com.pi.projetoacademia.repository;

import com.pi.projetoacademia.model.Aluno;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AlunoRepository extends JpaRepository<Aluno, Long> {

    Optional<Aluno> findByEmail(String email);

    Optional<Aluno> findByCpf(String cpf);

    List<Aluno> findByAtivoTrue();

    List<Aluno> findByNomeContainingIgnoreCaseOrContatoContaining(String nome, String contato);
}
