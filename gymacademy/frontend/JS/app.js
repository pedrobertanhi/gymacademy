// ============================================================
//  CONFIGURAÇÃO
// ============================================================
const URL_API = 'http://localhost:8080';

// ============================================================
//  SELETORES — index.html
// ============================================================
const areaVisitante      = document.getElementById('area-visitante');
const areaLogada         = document.getElementById('area-logada');
const textoUsuarioLogado = document.getElementById('texto-usuario-logado');
const textoPlanoStatus   = document.getElementById('texto-plano-status');

const cartaoLogin    = document.getElementById('cartao-login');
const cartaoCadastro = document.getElementById('cartao-cadastro');

const formularioAluno  = document.getElementById('formulario-aluno');
const formularioLogin  = document.getElementById('formulario-login');
const botaoIrCatraca   = document.getElementById('botao-ir-catraca');
const botaoSair        = document.getElementById('botao-sair');

const linkIrCadastro    = document.getElementById('link-ir-cadastro');
const linkVoltarLogin   = document.getElementById('link-voltar-login');
const linkEsqueceuSenha = document.getElementById('link-esqueceu-senha');

// ============================================================
//  SELETORES — catraca.html
// ============================================================
const visorStatus   = document.getElementById('visor-status');
const textoStatus   = document.getElementById('texto-status');
const detalheStatus = document.getElementById('detalhe-status');
const detalheData   = document.getElementById('detalhe-data');
const spinnerLoad   = document.getElementById('spinner-loading');

// ============================================================
//  1. CONTROLE DE SESSÃO (index.html)
// ============================================================
function verificarSessao() {
    if (!areaVisitante) return;

    const dadosSalvos = obterSessao();

    if (dadosSalvos) {
        areaVisitante.classList.add('escondido');
        areaLogada.classList.remove('escondido');

        textoUsuarioLogado.textContent = `Logado como: ${dadosSalvos.nome} (${dadosSalvos.email})`;

        // Exibir status do plano
        const hoje = new Date().toISOString().split('T')[0];
        const planoAtivo = dadosSalvos.dataFimPlano >= hoje;

        textoPlanoStatus.textContent = planoAtivo
            ? `✅ Plano ativo até ${formatarData(dadosSalvos.dataFimPlano)}`
            : `❌ Plano vencido em ${formatarData(dadosSalvos.dataFimPlano)}`;
        textoPlanoStatus.className = `status-plano ${planoAtivo ? 'ativo' : 'vencido'}`;

    } else {
        areaVisitante.classList.remove('escondido');
        areaLogada.classList.add('escondido');
        cartaoLogin.classList.remove('escondido');
        cartaoCadastro.classList.add('escondido');
    }
}

verificarSessao();

// ============================================================
//  2. NAVEGAÇÃO ENTRE LOGIN E CADASTRO
// ============================================================
if (linkIrCadastro) {
    linkIrCadastro.addEventListener('click', function (e) {
        e.preventDefault();
        cartaoLogin.classList.add('escondido');
        cartaoCadastro.classList.remove('escondido');
    });
}

if (linkVoltarLogin) {
    linkVoltarLogin.addEventListener('click', function (e) {
        e.preventDefault();
        cartaoCadastro.classList.add('escondido');
        cartaoLogin.classList.remove('escondido');
    });
}

if (linkEsqueceuSenha) {
    linkEsqueceuSenha.addEventListener('click', function (e) {
        e.preventDefault();
        alert('Aviso: A função de recuperar senha não faz parte do escopo deste projeto escolar! 😉');
    });
}

// ============================================================
//  3. CADASTRO DE ALUNO — POST /alunos
// ============================================================
if (formularioAluno) {
    formularioAluno.addEventListener('submit', function (e) {
        e.preventDefault();

        const btnCadastrar = formularioAluno.querySelector('button[type="submit"]');
        btnCadastrar.disabled = true;
        btnCadastrar.textContent = 'Cadastrando...';

        const aluno = {
            nome:         document.getElementById('nome-aluno').value,
            email:        document.getElementById('email-aluno').value,
            senha:        document.getElementById('senha-aluno').value,
            dataFimPlano: document.getElementById('data-fim-plano').value
        };

        fetch(`${URL_API}/alunos`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(aluno)
        })
        .then(async resposta => {
            const corpo = await resposta.json();
            if (resposta.ok) {
                mostrarMensagem('mensagem-cadastro', corpo.mensagem, 'sucesso');
                formularioAluno.reset();
                setTimeout(() => {
                    cartaoCadastro.classList.add('escondido');
                    cartaoLogin.classList.remove('escondido');
                }, 2000);
            } else {
                mostrarMensagem('mensagem-cadastro', corpo.mensagem || 'Erro ao cadastrar.', 'erro');
            }
        })
        .catch(() => {
            mostrarMensagem('mensagem-cadastro', '🔌 Servidor desligado. Verifique se o back-end está rodando.', 'erro');
        })
        .finally(() => {
            btnCadastrar.disabled = false;
            btnCadastrar.textContent = 'Cadastrar Aluno';
        });
    });
}

// ============================================================
//  4. LOGIN — POST /alunos/login
// ============================================================
if (formularioLogin) {
    formularioLogin.addEventListener('submit', function (e) {
        e.preventDefault();

        const btnLogin = formularioLogin.querySelector('button[type="submit"]');
        btnLogin.disabled = true;
        btnLogin.textContent = 'Entrando...';

        const credenciais = {
            email: document.getElementById('email-login').value,
            senha: document.getElementById('senha-login').value
        };

        fetch(`${URL_API}/alunos/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credenciais)
        })
        .then(async resposta => {
            const corpo = await resposta.json();
            if (resposta.ok) {
                // Salva os dados do aluno na sessão
                salvarSessao(corpo.dados);
                verificarSessao();
            } else {
                mostrarMensagem('mensagem-login', corpo.mensagem || 'Credenciais inválidas.', 'erro');
            }
        })
        .catch(() => {
            mostrarMensagem('mensagem-login', '🔌 Servidor desligado. Verifique se o back-end está rodando.', 'erro');
        })
        .finally(() => {
            btnLogin.disabled = false;
            btnLogin.textContent = 'Entrar no Sistema';
        });
    });
}

// ============================================================
//  5. SAIR DA CONTA
// ============================================================
if (botaoSair) {
    botaoSair.addEventListener('click', function () {
        limparSessao();
        verificarSessao();
    });
}

// ============================================================
//  6. IR PARA A CATRACA
// ============================================================
if (botaoIrCatraca) {
    botaoIrCatraca.addEventListener('click', function () {
        const sessao = obterSessao();
        if (sessao) {
            window.location.href = `catraca.html?email=${encodeURIComponent(sessao.email)}`;
        }
    });
}

// ============================================================
//  7. LÓGICA DA CATRACA — POST /acessos/liberar
// ============================================================
if (visorStatus) {
    const params     = new URLSearchParams(window.location.search);
    const emailAluno = params.get('email');

    if (!emailAluno) {
        esconderSpinner();
        textoStatus.textContent   = '⚠️ E-MAIL INVÁLIDO';
        detalheStatus.textContent = 'Faça login primeiro no sistema.';
    } else {
        fetch(`${URL_API}/acessos/liberar`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: emailAluno })
        })
        .then(async resposta => {
            esconderSpinner();
            const corpo = await resposta.json();

            if (resposta.ok) {
                // ✅ ACESSO LIBERADO
                document.body.classList.add('fundo-sucesso');
                textoStatus.textContent   = '✅ ACESSO LIBERADO';
                detalheStatus.textContent = `Bem-vindo, ${corpo.dados.aluno}! Bom treino!`;
                detalheData.textContent   = `Entrada registrada em: ${formatarDataHora(corpo.dados.dataHora)}`;

            } else if (resposta.status === 403) {
                // ❌ PLANO VENCIDO
                document.body.classList.add('fundo-erro');
                textoStatus.textContent   = '❌ ACESSO BLOQUEADO';
                detalheStatus.textContent = 'Seu plano está vencido.';
                detalheData.textContent   = corpo.mensagem || 'Procure a recepção para renovar.';

            } else if (resposta.status === 404) {
                // ⚠️ ALUNO NÃO ENCONTRADO
                document.body.classList.add('fundo-alerta');
                textoStatus.textContent   = '⚠️ ALUNO NÃO ENCONTRADO';
                detalheStatus.textContent = 'Verifique o e-mail cadastrado no sistema.';

            } else {
                document.body.classList.add('fundo-alerta');
                textoStatus.textContent   = '⚠️ ERRO INESPERADO';
                detalheStatus.textContent = corpo.mensagem || 'Tente novamente.';
            }
        })
        .catch(() => {
            esconderSpinner();
            document.body.classList.add('fundo-erro');
            textoStatus.textContent   = '🔌 ERRO DE CONEXÃO';
            detalheStatus.textContent = 'Servidor fora do ar. Contate o suporte.';
        });
    }
}

// ============================================================
//  FUNÇÕES AUXILIARES
// ============================================================

/** Exibe mensagem de sucesso ou erro em um elemento pelo ID */
function mostrarMensagem(idElemento, texto, tipo) {
    const el = document.getElementById(idElemento);
    if (!el) return;
    el.textContent = texto;
    el.className = tipo === 'sucesso' ? 'mensagem-sucesso' : 'mensagem-erro';
    setTimeout(() => { el.className = 'mensagem-oculta'; }, 5000);
}

/** Salva os dados do aluno logado no sessionStorage */
function salvarSessao(dados) {
    sessionStorage.setItem('alunoLogado', JSON.stringify(dados));
}

/** Lê os dados do aluno logado do sessionStorage */
function obterSessao() {
    const raw = sessionStorage.getItem('alunoLogado');
    return raw ? JSON.parse(raw) : null;
}

/** Remove a sessão (logout) */
function limparSessao() {
    sessionStorage.removeItem('alunoLogado');
}

/** Esconde o spinner de carregamento na tela da catraca */
function esconderSpinner() {
    if (spinnerLoad) spinnerLoad.classList.add('escondido');
}

/** Formata "2025-12-31" → "31/12/2025" */
function formatarData(dataISO) {
    if (!dataISO) return '';
    const [ano, mes, dia] = dataISO.split('-');
    return `${dia}/${mes}/${ano}`;
}

/** Formata datetime ISO para exibição amigável */
function formatarDataHora(isoString) {
    if (!isoString) return '';
    const d = new Date(isoString);
    return d.toLocaleString('pt-BR');
}
