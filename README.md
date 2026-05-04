# 🏋️‍♂️ Sistema de Controle de Acesso - Academia

## 📖 Sobre o Projeto
Este é um projeto acadêmico desenvolvido para o 3º semestre do curso de Análise e Desenvolvimento de Sistemas (ADS). O objetivo do sistema é gerenciar o cadastro de alunos de uma academia e controlar o acesso (entrada/catraca), validando automaticamente se o plano do aluno está ativo ou vencido.

Foi priorizada a simplicidade e a aplicação dos conceitos fundamentais de desenvolvimento web e programação orientada a objetos, utilizando uma arquitetura em camadas clara e fácil de manter.

## ⚙️ Funcionalidades Principais
* **Gestão de Alunos:** Cadastro de alunos com informações pessoais e período de vigência do plano (Data de Início e Fim).
* **Autenticação Simples:** Sistema de login básico via E-mail e Senha.
* **Controle de Acesso (Catraca):** Registro de entrada do aluno na academia.
* **Validação de Regra de Negócio:** O sistema bloqueia automaticamente a entrada se a data atual for superior à data de vencimento do plano do aluno.

## 🛠️ Tecnologias Utilizadas
**Back-end:**
* Java 17+
* Spring Boot (Web, Data JPA)
* Banco de Dados H2 (Em memória - facilita a execução e testes sem necessidade de configurações externas)

**Front-end:**
* HTML5
* CSS3
* JavaScript Puro (Vanilla JS com Fetch API para consumo do Back-end)

## 🏗️ Arquitetura do Sistema
O Back-end foi estruturado utilizando o padrão de camadas (Layered Architecture) para separar responsabilidades:
1. **Controller:** Responsável por receber as requisições HTTP (Front-end) e devolver as respostas (JSON).
2. **Service:** Onde residem as regras de negócio (ex: validação de plano vencido antes de liberar a catraca).
3. **Repository:** Camada de persistência, responsável pela comunicação direta com o banco de dados H2 através do Spring Data JPA.
4. **Model (Entidade):** Representação das tabelas do banco de dados em formato de classes Java (`Aluno`, `Acesso`).

## 🚀 Subir o projeto no repositorio

1. Subir Novas Versões:
   ```bash
   1. git init
   2. git add .
   3. git commit -m "nome do commmit"
   4. git push u- origin main (ou branch responsável)

1. Trocar de branch e conectar ao repositorio: 
   ```bash
    1. git remote add origin https://github.com/pedrobertanhi/gymacademy.git
    2. git branch -M main
    3. git push -u origin main
