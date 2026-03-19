package com.academia.gymacademy;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling   // Habilita tarefas agendadas (ex: notificar planos prestes a vencer)
public class GymAcademyApplication {

    public static void main(String[] args) {
        SpringApplication.run(GymAcademyApplication.class, args);
    }
}
