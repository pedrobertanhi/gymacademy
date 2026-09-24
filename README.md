<div align="center">

# Power Gym Center

**Sistema acadêmico para gestão de alunos, aulas, agendamentos e acesso à academia.**

![Java](https://img.shields.io/badge/Java-21-ED8B00?logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-4-6DB33F?logo=springboot&logoColor=white)
![H2](https://img.shields.io/badge/H2-Database-09476B)
![Status](https://img.shields.io/badge/status-em_desenvolvimento-F59E0B)

</div>

## Sobre o projeto

O **Power Gym Center** é um projeto acadêmico de gerenciamento de academia. A proposta reúne cadastro de alunos, grade de aulas, agendamentos e controle de entrada por catraca em uma única aplicação.

O repositório contém uma interface web demonstrativa e um backend Java com a estrutura da API. No estágio atual, parte do frontend funciona com dados locais e os principais serviços do backend ainda precisam ser implementados.

## Funcionalidades planejadas

- cadastro e consulta de alunos;
- gestão de administradores;
- criação e listagem de aulas;
- agendamento e cancelamento de aulas;
- consulta de vagas;
- liberação e registro de acesso pela catraca;
- persistência com Spring Data JPA.

## Estado atual

| Área | Situação |
| --- | --- |
| Interface web | disponível como protótipo demonstrativo |
| API REST | controladores e rotas estruturados |
| Banco de dados | H2 em memória configurado |
| Regras de negócio | implementação pendente em serviços principais |
| Autenticação | configuração inicial para desenvolvimento |

Algumas operações do backend retornam `501 Not Implemented` enquanto os métodos marcados como `TODO` não forem concluídos.

## Tecnologias

- Java 21;
- Spring Boot 4;
- Spring Web;
- Spring Data JPA;
- Spring Security;
- Bean Validation;
- banco H2;
- Maven;
- HTML, CSS e JavaScript no frontend.

## Como executar o backend

### Pré-requisitos

- Java 21.

No Linux ou macOS:

```bash
cd backend
./mvnw spring-boot:run
```

No Windows:

```powershell
cd backend
.\mvnw.cmd spring-boot:run
```

A API será iniciada em:

```text
http://localhost:8081
```

### Console do H2

```text
URL: http://localhost:8081/h2-console
JDBC URL: jdbc:h2:mem:powergym
Usuário: sa
Senha: deixe em branco
```

Como o banco está em memória, os dados são apagados quando a aplicação é encerrada.

## Como abrir o frontend

Abra a pasta do frontend com um servidor estático, como a extensão **Live Server** do VS Code. A versão atual serve como demonstração visual e pode usar armazenamento local do navegador.

## Estrutura

```text
gymacademy/
├── backend/
│   ├── src/main/java/       # API, entidades e serviços
│   ├── src/main/resources/  # configuração da aplicação
│   └── pom.xml
└── frontend/                # interface web
```

## Próximos passos

- implementar os métodos pendentes dos serviços;
- conectar o frontend à API;
- finalizar autenticação e autorização;
- adicionar persistência para ambientes de produção;
- validar o fluxo completo de agendamento e acesso.

---

Desenvolvido por [Pedro Bertanhi](https://github.com/pedrobertanhi).
