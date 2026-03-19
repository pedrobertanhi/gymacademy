package com.academia.gymacademy.repository;

import com.academia.gymacademy.model.Aluno;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AlunoRepository extends JpaRepository<Aluno, Long> {

    /**
     * Busca um aluno pelo e-mail. Usado no login e na validação da catraca.
     */
    Optional<Aluno> findByEmail(String email);

    /**
     * Busca um aluno pelo e-mail e senha. Usado na autenticação.
     */
    Optional<Aluno> findByEmailAndSenha(String email, String senha);

    /**
     * Verifica se já existe um aluno com determinado e-mail (evita duplicatas).
     */
    boolean existsByEmail(String email);
}
