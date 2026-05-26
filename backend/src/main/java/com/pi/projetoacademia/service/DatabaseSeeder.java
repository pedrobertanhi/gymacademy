package com.pi.projetoacademia.service;

import com.pi.projetoacademia.model.Admin;
import com.pi.projetoacademia.model.Aluno;
import com.pi.projetoacademia.repository.AdminRepository;
import com.pi.projetoacademia.repository.AlunoRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    private final AdminRepository adminRepository;
    private final AlunoRepository alunoRepository;
    private final PasswordEncoder passwordEncoder;

    public DatabaseSeeder(AdminRepository adminRepository, AlunoRepository alunoRepository, PasswordEncoder passwordEncoder) {
        this.adminRepository = adminRepository;
        this.alunoRepository = alunoRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        // Verifica se a tabela Admin está vazia
        if (adminRepository.count() == 0) {
            Admin admin = new Admin();
            admin.setNome("Administrador Padrão");
            admin.setEmail("admin@teste.com");
            // A senha "123456" será salva de forma embaralhada pelo passwordEncoder
            admin.setSenha(passwordEncoder.encode("123456"));
            adminRepository.save(admin);
            System.out.println("✅ Admin de teste criado: admin@teste.com / 123456");
        }

        // Verifica se a tabela Aluno está vazia
        if (alunoRepository.count() == 0) {
            Aluno aluno = new Aluno();
            aluno.setNome("Aluno de Teste");
            aluno.setEmail("aluno@teste.com");
            aluno.setSenha(passwordEncoder.encode("123456"));
            aluno.setCpf("000.000.000-00");
            aluno.setPlanoInicio(LocalDate.now());
            aluno.setPlanoFim(LocalDate.now().plusMonths(1));
            aluno.setAtivo(true);
            alunoRepository.save(aluno);
            System.out.println("✅ Aluno de teste criado: aluno@teste.com / 123456");
        }
    }
}