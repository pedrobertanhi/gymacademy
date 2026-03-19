package com.academia.gymacademy;

import com.academia.gymacademy.model.Aluno;
import com.academia.gymacademy.repository.AlunoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

/**
 * Popula o banco H2 com dados de teste ao iniciar a aplicação.
 * Facilita testes sem necessidade de cadastrar manualmente.
 */
@Component
public class DataLoader implements CommandLineRunner {

    @Autowired
    private AlunoRepository alunoRepository;

    @Override
    public void run(String... args) throws Exception {

        // Aluno com plano ATIVO (vence daqui a 30 dias)
        Aluno ativo = new Aluno(
                "João Silva",
                "joao@email.com",
                "123456",
                LocalDate.now(),
                LocalDate.now().plusDays(30)
        );

        // Aluno com plano VENCIDO (venceu há 5 dias)
        Aluno vencido = new Aluno(
                "Maria Souza",
                "maria@email.com",
                "123456",
                LocalDate.now().minusMonths(1),
                LocalDate.now().minusDays(5)
        );

        // Aluno com plano vencendo HOJE
        Aluno venceHoje = new Aluno(
                "Carlos Pereira",
                "carlos@email.com",
                "123456",
                LocalDate.now().minusMonths(1),
                LocalDate.now()
        );

        alunoRepository.save(ativo);
        alunoRepository.save(vencido);
        alunoRepository.save(venceHoje);

        System.out.println("==============================================");
        System.out.println("✅  DADOS DE TESTE CARREGADOS COM SUCESSO!");
        System.out.println("----------------------------------------------");
        System.out.println("  Aluno 1 (Plano ATIVO):   joao@email.com  / 123456");
        System.out.println("  Aluno 2 (Plano VENCIDO): maria@email.com / 123456");
        System.out.println("  Aluno 3 (Vence HOJE):    carlos@email.com/ 123456");
        System.out.println("----------------------------------------------");
        System.out.println("  Console H2: http://localhost:8080/h2-console");
        System.out.println("  JDBC URL:   jdbc:h2:mem:academiadb");
        System.out.println("==============================================");
    }
}
