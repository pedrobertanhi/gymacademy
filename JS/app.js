// URL do servidor Back-end (quando ele existir)
const URL_API = 'http://localhost:8080';

// Elementos da tela index.html
const areaVisitante = document.getElementById('area-visitante');
const areaLogada = document.getElementById('area-logada');
const textoUsuarioLogado = document.getElementById('texto-usuario-logado');

// Elementos dos Cartões
const cartaoLogin = document.getElementById('cartao-login');
const cartaoCadastro = document.getElementById('cartao-cadastro');

// Formulários e Botões principais
const formularioAluno = document.getElementById('formulario-aluno');
const formularioLogin = document.getElementById('formulario-login');
const botaoIrCatraca = document.getElementById('botao-ir-catraca');
const botaoSair = document.getElementById('botao-sair');

// Links auxiliares
const linkIrCadastro = document.getElementById('link-ir-cadastro');
const linkVoltarLogin = document.getElementById('link-voltar-login');
const linkEsqueceuSenha = document.getElementById('link-esqueceu-senha');

// Elementos da tela catraca.html
const visorStatus = document.getElementById('visor-status');
const textoStatus = document.getElementById('texto-status');
const detalheStatus = document.getElementById('detalhe-status');

// --- 1. CONTROLE DE SESSÃO (Para index.html) ---
function verificarSessao() {
    if (!areaVisitante) return; 

    const emailSalvo = localStorage.getItem('emailLogado');

    if (emailSalvo) {
        // Usuário logado: esconde tudo de visitante e mostra painel logado
        areaVisitante.classList.add('escondido');
        areaLogada.classList.remove('escondido');
        textoUsuarioLogado.textContent = `Você está logado como: ${emailSalvo}`;
    } else {
        // Usuário deslogado: mostra área de visitante
        areaVisitante.classList.remove('escondido');
        areaLogada.classList.add('escondido');
        
        // Garante que o Login é a primeira coisa a aparecer, e o Cadastro fica escondido
        cartaoLogin.classList.remove('escondido');
        cartaoCadastro.classList.add('escondido');
    }
}

// Executa assim que a página carrega
verificarSessao();

// --- 2. NAVEGAÇÃO ENTRE LOGIN E CADASTRO ---
if (linkIrCadastro) {
    linkIrCadastro.addEventListener('click', function(evento) {
        evento.preventDefault(); // Evita que a página recarregue
        cartaoLogin.classList.add('escondido');
        cartaoCadastro.classList.remove('escondido');
    });
}

if (linkVoltarLogin) {
    linkVoltarLogin.addEventListener('click', function(evento) {
        evento.preventDefault();
        cartaoCadastro.classList.add('escondido');
        cartaoLogin.classList.remove('escondido');
    });
}

if (linkEsqueceuSenha) {
    linkEsqueceuSenha.addEventListener('click', function(evento) {
        evento.preventDefault();
        alert("Aviso: A função de recuperar senha não faz parte do escopo deste projeto escolar! 😉");
    });
}

// --- 3. LÓGICA DE CADASTRO E LOGIN (index.html) ---
if (formularioLogin) {
    
    // Evento de Cadastrar Aluno
    formularioAluno.addEventListener('submit', function(evento) {
        evento.preventDefault();
        
        const aluno = {
            nome: document.getElementById('nome-aluno').value,
            email: document.getElementById('email-aluno').value,
            senha: document.getElementById('senha-aluno').value,
            dataFimPlano: document.getElementById('data-fim-plano').value
        };

        fetch(`${URL_API}/alunos`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(aluno)
        })
        .then(resposta => {
            if (resposta.ok) {
                mostrarMensagem('mensagem-cadastro', 'Aluno cadastrado! Redirecionando para login...', 'sucesso');
                formularioAluno.reset();
                
                // Manda o usuário de volta para a tela de login depois de 2 segundos
                setTimeout(() => {
                    cartaoCadastro.classList.add('escondido');
                    cartaoLogin.classList.remove('escondido');
                }, 2000);
            } else {
                mostrarMensagem('mensagem-cadastro', 'Erro no cadastro.', 'erro');
            }
        })
        .catch(erro => {
            mostrarMensagem('mensagem-cadastro', 'Servidor desligado (Teste Front-end).', 'erro');
        });
    });

    // Evento de Fazer Login (Simulado no Front-end por enquanto)
    formularioLogin.addEventListener('submit', function(evento) {
        evento.preventDefault();
        const email = document.getElementById('email-login').value;
        
        // Salva o email no navegador para simular que está logado
        localStorage.setItem('emailLogado', email); 
        verificarSessao(); 
    });

    // Evento do Botão Sair da Conta
    botaoSair.addEventListener('click', function() {
        localStorage.removeItem('emailLogado'); 
        verificarSessao(); 
    });

    // Evento do Botão Ir para Catraca
    botaoIrCatraca.addEventListener('click', function() {
        const email = localStorage.getItem('emailLogado');
        window.location.href = `catraca.html?email=${email}`;
    });
}

// --- 4. LÓGICA DO VISOR DA CATRACA (catraca.html) ---
if (visorStatus) {
    const parametrosUrl = new URLSearchParams(window.location.search);
    const emailAluno = parametrosUrl.get('email');

    if (emailAluno) {
        fetch(`${URL_API}/acessos/liberar`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: emailAluno })
        })
        .then(resposta => {
            if (resposta.ok) {
                document.body.classList.add('fundo-sucesso');
                textoStatus.textContent = '✅ ACESSO LIBERADO';
                detalheStatus.textContent = 'Catraca aberta. Bom treino!';
            } else if (resposta.status === 403) {
                document.body.classList.add('fundo-erro');
                textoStatus.textContent = '❌ ACESSO BLOQUEADO';
                detalheStatus.textContent = 'Seu plano está vencido. Procure a recepção.';
            } else {
                document.body.classList.add('fundo-alerta');
                textoStatus.textContent = '⚠️ ALUNO NÃO ENCONTRADO';
                detalheStatus.textContent = 'Verifique o e-mail cadastrado.';
            }
        })
        .catch(erro => {
            document.body.classList.add('fundo-erro');
            textoStatus.textContent = '🔌 ERRO DE CONEXÃO';
            detalheStatus.textContent = 'Servidor fora do ar.';
        });
    } else {
        textoStatus.textContent = '⚠️ E-MAIL INVÁLIDO';
        detalheStatus.textContent = 'Faça login primeiro no sistema.';
    }
}

// --- 5. FUNÇÃO AUXILIAR ---
function mostrarMensagem(idElemento, texto, tipo) {
    const elemento = document.getElementById(idElemento);
    elemento.textContent = texto;
    elemento.className = tipo === 'sucesso' ? 'mensagem-sucesso' : 'mensagem-erro';
    
    // Some com a mensagem depois de 4 segundos
    setTimeout(() => { elemento.className = 'mensagem-oculta'; }, 4000);
}