# 🏋️‍♂️ Power Gym Center — Sistema de Controle de Acesso

Projeto acadêmico do 3º semestre de Análise e Desenvolvimento de Sistemas (ADS). Sistema para gerenciar cadastro de alunos de uma academia e controlar a entrada (catraca), validando se o plano está ativo ou vencido.

---

## 📌 Status do Projeto

| Item | Status |
|---|---|
| Estrutura Spring Boot MVC em camadas | ✅ Pronto |
| Frontend integrado em `static/` (servido pelo Spring) | ✅ Pronto |
| Entidades JPA (Aluno, Admin, Aula, Acesso, Agendamento) | ✅ Prontas |
| Repositories (JpaRepository) | ✅ Prontos |
| DTOs (request/response) | ✅ Prontos |
| Controllers REST com 18 endpoints declarados | ✅ Prontos |
| SecurityConfig + CorsConfig + GlobalExceptionHandler | ✅ Prontos |
| **Lógica dos Services (regras de negócio)** | ❌ **TODO — equipe backend** |
| **Frontend ainda usa `localStorage`** (precisa migrar pra `fetch()` da API) | ⚠️ **NÃO removido — equipe precisa decidir** |

> **TL;DR para a equipe:** o esqueleto está todo pronto. Vocês precisam **(A)** preencher os métodos dos `*Service.java` (eles hoje lançam `UnsupportedOperationException` → HTTP 501), e **(B)** decidir se vão refatorar o JS pra usar `fetch()` agora ou testar os endpoints via Postman/Insomnia primeiro.

---

## 🛠️ Stack

**Backend:** Java 21 · Spring Boot 4.0.5 · Spring Web MVC · Spring Data JPA · Spring Security · Lombok · MySQL 8

**Frontend:** HTML5 · CSS3 · JavaScript Vanilla (servido pelo Spring em `static/`)

---

## 🚀 Como rodar (passo a passo)

### Pré-requisitos
1. **Java 21 (JDK)** — `java -version` deve mostrar 21.x
2. **MySQL 8** rodando em `localhost:3306`
   - Usuário: `root`
   - Senha: **vazia** (se a sua for diferente, ver "Ajustes" abaixo)
3. **Git** (já tem se clonou o repo)

> Não precisa instalar Maven — o projeto usa o **Maven Wrapper** (`mvnw.cmd` no Windows / `./mvnw` no Linux/Mac).

### Subir
```powershell
# Windows (PowerShell)
cd backend
.\mvnw.cmd spring-boot:run
```
```bash
# Linux / Mac
cd backend
./mvnw spring-boot:run
```

### Acessar
Abra no navegador: **http://localhost:8080**

A página `index.html` redireciona automaticamente pra `login.html`. Login default (criado em memória pelo seed do JS):
- E-mail: `admin@powergymcenter.com`
- Senha: `admin123`

### Ajustes que podem ser necessários

| Problema | Solução | Onde |
|---|---|---|
| MySQL com senha diferente de vazia | `spring.datasource.password=SUA_SENHA` | [application.properties](backend/src/main/resources/application.properties) |
| Porta 8080 ocupada | `server.port=8081` | [application.properties](backend/src/main/resources/application.properties) |
| MySQL em outro host/porta | Editar `spring.datasource.url=jdbc:mysql://HOST:PORTA/powergym?...` | mesmo arquivo |

O schema `powergym` é criado automaticamente (`createDatabaseIfNotExist=true`). As 5 tabelas são geradas pelo Hibernate na primeira subida (`spring.jpa.hibernate.ddl-auto=update`).

---

## 🏗️ Arquitetura

```
gymacademy/
└── backend/
    ├── pom.xml
    ├── mvnw, mvnw.cmd, .mvn/
    └── src/
        ├── main/
        │   ├── java/com/pi/projetoacademia/
        │   │   ├── ProjetoacademiaApplication.java   ← bootstrap
        │   │   ├── controller/   ← endpoints REST  (/api/...)
        │   │   ├── service/      ← regras de negócio (TODO da equipe)
        │   │   ├── repository/   ← persistência (JpaRepository)
        │   │   ├── model/        ← entidades JPA
        │   │   ├── dto/          ← objetos de transporte
        │   │   └── config/       ← SecurityConfig, CorsConfig, ExceptionHandler
        │   └── resources/
        │       ├── application.properties
        │       └── static/       ← FRONTEND (HTML, CSS, JS, assets)
        └── test/...
```

### As 5 entidades

| Entidade | Tabela | Campos principais |
|---|---|---|
| `Aluno` | `alunos` | id, nome, email, contato, cpf, genero, planoInicio, planoFim, ativo |
| `Admin` | `admins` | id, nome, email, senha (BCrypt), contato, genero |
| `Aula` | `aulas` | id, nome, professor, dia, horarioInicio/Fim, capacidade, status (ABERTA/CHEIA/CANCELADA), imagem |
| `Acesso` | `acessos` | id, aluno (FK), momento, liberado, motivo |
| `Agendamento` | `agendamentos` | id, aluno (FK), aula (FK), agendadoEm — `(aluno_id, aula_id)` é UNIQUE |

---

## 🔌 Endpoints REST (já declarados nos controllers)

> Todos respondem **HTTP 501 Not Implemented** até a equipe preencher os services. Isso é normal e foi configurado de propósito (ver [GlobalExceptionHandler](backend/src/main/java/com/pi/projetoacademia/config/GlobalExceptionHandler.java)).

### Admin / Login
| Método | Rota | Body | Service método |
|---|---|---|---|
| POST | `/api/admin/login` | `{email, senha}` | `AdminService.autenticar` |
| POST | `/api/admin` | `{nome, email, senha, contato, genero}` | `AdminService.cadastrar` |
| POST | `/api/admin/redefinir-senha` | `{email, novaSenha}` | `AdminService.redefinirSenha` |

### Alunos
| Método | Rota | Service método |
|---|---|---|
| GET | `/api/alunos` | `AlunoService.listar` |
| GET | `/api/alunos/buscar?q=joao` | `AlunoService.buscar` |
| GET | `/api/alunos/ativos/contagem` | `AlunoService.contarAtivos` |
| GET | `/api/alunos/{id}` | `AlunoService.buscarPorId` |
| POST | `/api/alunos` | `AlunoService.criar` |
| PUT | `/api/alunos/{id}` | `AlunoService.atualizar` |
| DELETE | `/api/alunos/{id}` | `AlunoService.deletar` |

### Aulas
| Método | Rota | Service método |
|---|---|---|
| GET | `/api/aulas` | `AulaService.listar` |
| GET | `/api/aulas/{id}` | `AulaService.buscarPorId` |
| POST | `/api/aulas` | `AulaService.criar` |
| PUT | `/api/aulas/{id}` | `AulaService.atualizar` |
| POST | `/api/aulas/{id}/cancelar` | `AulaService.cancelar` |

### Agendamentos
| Método | Rota | Service método |
|---|---|---|
| POST | `/api/agendamentos` | `AgendamentoService.agendar` |
| DELETE | `/api/agendamentos?alunoId=&aulaId=` | `AgendamentoService.cancelar` |

### Catraca (regra de negócio principal)
| Método | Rota | Service método |
|---|---|---|
| POST | `/api/catraca/liberar/{alunoId}` | `CatracaService.liberar` |

---

## 👨‍💻 PASSO A PASSO PARA A EQUIPE BACKEND (3h de trampo)

### Passo 1 — Clonar e subir (5 min)
```powershell
git clone https://github.com/pedrobertanhi/gymacademy.git
cd gymacademy/backend
.\mvnw.cmd spring-boot:run
```
Confirme que abre `http://localhost:8080` mostrando o login. Aceita login fake (admin@powergymcenter.com / admin123) — **isso usa localStorage, ainda não fala com o backend**.

### Passo 2 — Encontrar o que falta (1 min)
```powershell
# No PowerShell, dentro de backend/
Select-String -Path "src\main\java\**\*.java" -Pattern "TODO" -SimpleMatch
```
Vai listar **~20 métodos** com comentário `// TODO` explicando exatamente o que cada um precisa fazer.

### Passo 3 — Implementar os Services na ordem sugerida (~2h)

Sugestão de ordem (cada um pode pegar um service):

1. **`AdminService`** — login + cadastro de admin (use `BCryptPasswordEncoder` que já está injetado)
2. **`AlunoService`** — CRUD básico, mapeamento Entity ↔ DTO. A flag `planoVencido` em `AlunoResponseDTO` é só `LocalDate.now().isAfter(aluno.getPlanoFim())`
3. **`AulaService`** — CRUD + contar agendados via `agendamentoRepository.countByAulaId()`
4. **`AgendamentoService`** — validar plano ativo, status da aula, capacidade, duplicidade
5. **`CatracaService`** — *o coração do sistema*: validar plano vencido, criar registro de `Acesso`, retornar resultado

**Padrão de implementação:** trocar `throw new UnsupportedOperationException(...)` pela lógica real. Use os métodos já criados nos Repositories — eles cobrem 90% das queries que vocês vão precisar.

### Passo 4 — Testar (15 min por endpoint, via Postman ou Insomnia)

Exemplo de teste do login:
```
POST http://localhost:8080/api/admin/login
Content-Type: application/json

{
  "email": "admin@powergymcenter.com",
  "senha": "admin123"
}
```

Como o frontend ainda usa localStorage, o jeito mais rápido de validar o backend é via Postman.

### Passo 5 (opcional, se sobrar tempo) — Conectar o frontend ao backend (~1h)

**O frontend HOJE usa `localStorage`** (ver [shared.js](backend/src/main/resources/static/js/shared.js) — função `PowerGym.seed()`). Pra conectar de verdade, é preciso refatorar os JS:

```powershell
# Pra ver onde tem localStorage no frontend:
Select-String -Path "src\main\resources\static\js\*.js" -Pattern "localStorage" -SimpleMatch
```

Refatoração típica:
```js
// ANTES (localStorage)
const alunos = PowerGym.alunos();

// DEPOIS (fetch da API)
const alunos = await fetch('/api/alunos').then(r => r.json());
```

Arquivos que precisam ser refatorados:
- [login.js](backend/src/main/resources/static/js/login.js) — usar `POST /api/admin/login`
- [cadastro.js](backend/src/main/resources/static/js/cadastro.js) — usar `POST /api/admin`
- [home.js](backend/src/main/resources/static/js/home.js) — usar `GET /api/alunos` e `GET /api/alunos/ativos/contagem`
- [novo-cadastro.js](backend/src/main/resources/static/js/novo-cadastro.js) — usar `POST /api/alunos`
- [atualizar-cadastro.js](backend/src/main/resources/static/js/atualizar-cadastro.js) — usar `PUT /api/alunos/{id}`
- [cadastro-alunos.js](backend/src/main/resources/static/js/cadastro-alunos.js) — listagem
- [agenda.js](backend/src/main/resources/static/js/agenda.js) — usar `/api/aulas` e `/api/agendamentos`
- [redefinir-senha.js](backend/src/main/resources/static/js/redefinir-senha.js) — usar `POST /api/admin/redefinir-senha`

> **Estratégia recomendada para 3h:** focar 100% nos services. Deixar o `localStorage→fetch` pra outra leva. O frontend continua funcionando "fake" enquanto o backend é provado por Postman.

---

## 🔒 Segurança (modo dev)

`SecurityConfig` está com **tudo liberado** (`anyRequest().permitAll()`) pra não atrapalhar o desenvolvimento. **Antes de produção**, restringir `/api/**` com autenticação real (JWT recomendado). Tem `// TODO` no arquivo marcando isso.

`BCryptPasswordEncoder` já está como `@Bean` — usem `passwordEncoder.encode(senha)` ao salvar e `passwordEncoder.matches(plain, hash)` ao validar login.

CORS está aberto em `/api/**` pra qualquer origem — útil se algum colega quiser servir o frontend separado durante o dev.

---

## 🌐 Sobre Deploy (importante)

**Para o trabalho acadêmico, vocês NÃO precisam fazer deploy.** A apresentação pode (e deve) ser feita rodando o projeto localmente:
1. Pessoa que vai apresentar abre o terminal
2. `cd backend && .\mvnw.cmd spring-boot:run`
3. Abre `http://localhost:8080` no navegador
4. Demonstra o sistema funcionando

**Por que NÃO usar Firebase Hosting:** Firebase Hosting só serve arquivos estáticos (HTML/CSS/JS). Como o backend é uma aplicação Java + MySQL que precisa de um servidor rodando, ele ignoraria toda a parte do Spring Boot. Não funcionaria.

**Se o professor exigir deploy real**, considerem (em ordem de facilidade):
- **Render.com** — free tier, suporta Spring Boot direto do GitHub, ~10 min de configuração
- **Railway.app** — similar ao Render
- **Google Cloud Run** — exige criar `Dockerfile`, mais complexo

Mas, repetindo: **rodar local na hora da apresentação é o normal pra projeto acadêmico**. Não percam tempo com deploy se não for cobrado.

---

## 📦 Subir versões no Git

```bash
git add .
git commit -m "feat: implementa AlunoService.criar"
git push origin main
```

> Sugestão: cada pessoa cria sua branch (`feat/aluno-service`, `feat/catraca`, etc) e abre PR pra `main`.

---

## 📞 Dúvidas

Se algum endpoint ou service não estiver claro, abra a issue ou pergunte no grupo. Os comentários `// TODO` nos services explicam a regra esperada de cada método.
