# 🏋️‍♂️ GymAcademy v2.0 — Sistema de Controle de Acesso

> Projeto acadêmico — 3º Semestre ADS  
> Arquitetura profissional com Spring Boot + JWT + Frontend SPA

---

## 🗂️ Estrutura do Projeto

```
gymacademy/
├── backend/                          ← Spring Boot
│   ├── pom.xml
│   └── src/main/java/com/academia/gymacademy/
│       ├── GymAcademyApplication.java
│       ├── DataLoader.java            ← Dados de teste
│       ├── config/
│       │   └── SecurityConfig.java    ← Spring Security + CORS + JWT
│       ├── security/
│       │   ├── JwtUtil.java           ← Geração e validação de tokens
│       │   └── JwtAuthFilter.java     ← Filtro de autenticação
│       ├── model/
│       │   ├── Aluno.java             ← Entidade principal (implements UserDetails)
│       │   ├── Acesso.java            ← Registro de entradas na catraca
│       │   └── RenovacaoPlano.java    ← Histórico de renovações
│       ├── enums/
│       │   ├── Role.java              ← ALUNO, RECEPCIONISTA, ADMIN
│       │   ├── StatusAcesso.java      ← LIBERADO, BLOQUEADO_*
│       │   └── TipoPlano.java         ← MENSAL, TRIMESTRAL, SEMESTRAL, ANUAL
│       ├── repository/                ← Spring Data JPA
│       ├── service/
│       │   ├── AlunoService.java      ← Cadastro, login, renovação, @Scheduled
│       │   └── AcessoService.java     ← Catraca + Dashboard
│       ├── controller/
│       │   ├── AuthController.java    ← /api/auth/**
│       │   ├── AlunoController.java   ← /api/alunos/**
│       │   ├── AcessoController.java  ← /api/acessos/**
│       │   ├── DashboardController.java
│       │   └── GlobalExceptionHandler.java
│       ├── dto/
│       │   ├── request/               ← DTOs de entrada
│       │   └── response/              ← DTOs de saída
│       └── exception/
│
└── frontend/                          ← HTML + CSS + JS Puro
    ├── index.html                     ← Login / Cadastro
    ├── css/
    │   ├── main.css                   ← Design system (variáveis, botões, tabela...)
    │   ├── auth.css                   ← Tela de login
    │   ├── dashboard.css              ← Painel admin
    │   └── catraca.css                ← Tela da catraca
    ├── js/
    │   ├── utils/
    │   │   ├── api.js                 ← Client HTTP com JWT automático
    │   │   └── storage.js             ← Sessão + helpers de formatação
    │   └── modules/
    │       ├── auth.js                ← Login e cadastro
    │       ├── dashboard.js           ← Painel admin completo
    │       ├── catraca.js             ← Tela da catraca
    │       └── perfil.js              ← Área do aluno
    └── pages/
        ├── dashboard.html             ← Painel Admin/Recepcionista
        ├── catraca.html               ← Visor da catraca
        └── perfil.html                ← Perfil do aluno
```

---

## ⚙️ Funcionalidades Implementadas

### Autenticação e Segurança
- [x] Login com JWT (token Bearer, 24h de validade)
- [x] Senha com BCrypt (nunca armazenada em texto puro)
- [x] Roles: `ADMIN`, `RECEPCIONISTA`, `ALUNO`
- [x] Rotas protegidas com `@PreAuthorize`
- [x] Filtro JWT em cada requisição (`JwtAuthFilter`)
- [x] CORS configurável por perfil

### Gestão de Alunos
- [x] Cadastro com validação (e-mail e CPF únicos)
- [x] Login com credenciais
- [x] Listagem paginada com busca por nome/e-mail
- [x] Edição de dados (nome, telefone)
- [x] Alteração de senha (verifica senha atual)
- [x] Ativar / Desativar aluno (sem deletar)
- [x] Promoção de Role (ADMIN pode promover)

### Planos
- [x] 4 tipos: Mensal, Trimestral, Semestral, Anual
- [x] Duração e preço automáticos por tipo
- [x] Renovação pelo admin/recepcionista (valor personalizável)
- [x] Lógica de data: renovação começa no dia seguinte ao fim atual
- [x] Histórico completo de renovações

### Catraca (Controle de Acesso)
- [x] Validação em tempo real: plano ativo ou vencido
- [x] Bloqueio por plano vencido **e** por aluno inativo
- [x] Registro de cada tentativa (LIBERADO / BLOQUEADO)
- [x] Tela fullscreen responsiva com animações
- [x] Auto-retorno após 5 segundos (modo quiosque)
- [x] Relógio em tempo real
- [x] Alerta no log se plano vence em até 7 dias

### Dashboard Admin
- [x] Total de alunos, planos ativos/vencidos
- [x] Acessos do dia e da semana
- [x] Bloqueios do dia
- [x] Receita do mês (baseada em renovações)
- [x] Planos vencendo em 7 dias
- [x] Feed dos últimos 10 acessos em tempo real
- [x] Listagem de alunos com barra de progresso do plano

### Tarefas Agendadas
- [x] `@Scheduled` diário às 8h: loga alunos com plano vencendo em 7 dias
  *(hook pronto para integrar envio de e-mail ou WhatsApp)*

---

## 🚀 Como Rodar

### Pré-requisitos
- Java 17+
- Maven 3.8+
- Um servidor de arquivos estático para o frontend (ex: VS Code Live Server, Python, Nginx)

### 1. Back-end
```bash
cd backend
mvn spring-boot:run
# Acesse: http://localhost:8080
```

### 2. Front-end
```bash
# Opção A — VS Code: instale a extensão Live Server e abra index.html
# Opção B — Python:
cd frontend
python3 -m http.server 5500
# Acesse: http://localhost:5500
```

> ⚠️ **CORS:** A URL `http://localhost:5500` já está na lista de origens permitidas.  
> Adicione outras URLs em `application.properties` → `app.cors.allowed-origins`

---

## 👤 Usuários de Teste

| Nome              | E-mail                    | Senha        | Role           | Plano    |
|-------------------|---------------------------|--------------|----------------|----------|
| Administrador     | `admin@academia.com`      | `admin123`   | ADMIN          | ✅ Ativo |
| Fernanda Lima     | `recepcao@academia.com`   | `recepcao123`| RECEPCIONISTA  | ✅ Ativo |
| João Silva        | `joao@email.com`          | `123456`     | ALUNO          | ✅ Ativo |
| Maria Souza       | `maria@email.com`         | `123456`     | ALUNO          | ✅ Ativo |
| Carlos Pereira    | `carlos@email.com`        | `123456`     | ALUNO          | ❌ Vencido |
| Ana Beatriz       | `ana@email.com`           | `123456`     | ALUNO          | ⚠️ Vencendo |
| Lucas Martins     | `lucas@email.com`         | `123456`     | ALUNO          | ✅ Ativo |

---

## 📡 API Reference

### Auth (público)
```
POST /api/auth/cadastro   → { nome, email, senha, tipoPlano, cpf?, telefone? }
POST /api/auth/login      → { email, senha }  → retorna token JWT
```

### Alunos (autenticado)
```
GET    /api/alunos?q=&page=0&size=10   → lista paginada (ADMIN/RECEP)
GET    /api/alunos/me                  → dados do usuário logado
GET    /api/alunos/{id}                → por ID (ADMIN/RECEP)
PUT    /api/alunos/{id}                → atualizar nome/telefone
PATCH  /api/alunos/{id}/senha          → alterar senha
PATCH  /api/alunos/{id}/status?ativo=  → ativar/desativar (ADMIN/RECEP)
POST   /api/alunos/{id}/renovar        → renovar plano (ADMIN/RECEP)
GET    /api/alunos/{id}/renovacoes     → histórico de renovações
PATCH  /api/alunos/{id}/role?role=     → promover role (ADMIN)
```

### Acessos / Catraca
```
POST /api/acessos/liberar              → { email } → libera ou bloqueia
GET  /api/acessos/ultimos              → últimos 10 (ADMIN/RECEP)
GET  /api/acessos/historico/{alunoId}  → paginado (ADMIN/RECEP)
```

### Dashboard
```
GET /api/dashboard   → métricas completas (ADMIN/RECEP)
```

### Utilitários
```
GET  /h2-console          → Console do banco H2 (dev)
GET  /actuator/health     → Status da aplicação
```

---

## 🗄️ Console H2

Acesse `http://localhost:8080/h2-console`:
- **JDBC URL:** `jdbc:h2:mem:academiadb`
- **User:** `sa`
- **Password:** *(vazio)*

---

## 🔜 O que você pode adicionar

- [ ] Envio de e-mail de alerta de vencimento (Spring Mail + Gmail SMTP)
- [ ] Upload de foto de perfil (Multer / S3)
- [ ] Relatórios PDF de frequência
- [ ] QR Code para liberação da catraca
- [ ] Notificações push (PWA)
- [ ] Migração para MySQL em produção (já configurado em `application-prod.properties`)
- [ ] Testes unitários (estrutura de pastas já criada)

---

## 📤 Git

```bash
# Configurar repositório
git remote add origin https://github.com/pedrobertanhi/gymacademy.git
git branch -M main
git push -u origin main

# Enviar novas versões
git add .
git commit -m "feat: descrição da mudança"
git push origin main
```
