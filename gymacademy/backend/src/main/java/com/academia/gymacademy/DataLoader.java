package com.academia.gymacademy;

import com.academia.gymacademy.enums.Role;
import com.academia.gymacademy.enums.TipoPlano;
import com.academia.gymacademy.model.Aluno;
import com.academia.gymacademy.repository.AlunoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
public class DataLoader implements CommandLineRunner {

    @Autowired private AlunoRepository alunoRepository;
    @Autowired private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {

        // ===== ADMIN =====
        criarAluno("Administrador", "admin@academia.com", "admin123",
                Role.ADMIN, TipoPlano.ANUAL, LocalDate.now(), LocalDate.now().plusYears(10));

        // ===== RECEPCIONISTA =====
        criarAluno("Fernanda Lima", "recepcao@academia.com", "recepcao123",
                Role.RECEPCIONISTA, TipoPlano.ANUAL, LocalDate.now(), LocalDate.now().plusYears(10));

        // ===== ALUNOS =====
        criarAluno("João Silva", "joao@email.com", "123456",
                Role.ALUNO, TipoPlano.MENSAL, LocalDate.now().minusDays(5), LocalDate.now().plusDays(25));

        criarAluno("Maria Souza", "maria@email.com", "123456",
                Role.ALUNO, TipoPlano.TRIMESTRAL, LocalDate.now().minusDays(20), LocalDate.now().plusDays(70));

        criarAluno("Carlos Pereira", "carlos@email.com", "123456",
                Role.ALUNO, TipoPlano.MENSAL, LocalDate.now().minusDays(35), LocalDate.now().minusDays(5)); // VENCIDO

        criarAluno("Ana Beatriz", "ana@email.com", "123456",
                Role.ALUNO, TipoPlano.SEMESTRAL, LocalDate.now().minusDays(10), LocalDate.now().plusDays(5)); // VENCENDO EM BREVE

        criarAluno("Lucas Martins", "lucas@email.com", "123456",
                Role.ALUNO, TipoPlano.ANUAL, LocalDate.now().minusDays(60), LocalDate.now().plusDays(305));

        System.out.println("""
                
                ╔══════════════════════════════════════════════════╗
                ║         🏋️  GymAcademy v2.0 - INICIADO          ║
                ╠══════════════════════════════════════════════════╣
                ║  ADMIN:        admin@academia.com / admin123     ║
                ║  RECEPÇÃO:     recepcao@academia.com / recepcao123║
                ╠══════════════════════════════════════════════════╣
                ║  ALUNOS (senha: 123456)                          ║
                ║  ✅ Ativo:     joao@email.com                    ║
                ║  ✅ Ativo:     maria@email.com                   ║
                ║  ❌ Vencido:   carlos@email.com                  ║
                ║  ⚠️  Vencendo: ana@email.com (5 dias)            ║
                ║  ✅ Ativo:     lucas@email.com                   ║
                ╠══════════════════════════════════════════════════╣
                ║  API:    http://localhost:8080/api               ║
                ║  H2 DB:  http://localhost:8080/h2-console        ║
                ║  Health: http://localhost:8080/actuator/health   ║
                ╚══════════════════════════════════════════════════╝
                """);
    }

    private void criarAluno(String nome, String email, String senha, Role role,
                             TipoPlano tipoPlano, LocalDate inicio, LocalDate fim) {
        if (alunoRepository.existsByEmail(email)) return;
        Aluno a = new Aluno();
        a.setNome(nome);
        a.setEmail(email);
        a.setSenha(passwordEncoder.encode(senha));
        a.setRole(role);
        a.setTipoPlano(tipoPlano);
        a.setDataInicio(inicio);
        a.setDataFimPlano(fim);
        alunoRepository.save(a);
    }
}
