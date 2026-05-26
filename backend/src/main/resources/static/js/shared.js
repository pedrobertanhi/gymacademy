/* ============================================
   CONTROLE DE ACESSO E SIDEBAR (RBAC)
   Adicionado para proteger rotas e ocultar menus
   ============================================ */
document.addEventListener("DOMContentLoaded", () => {
    const userRole = sessionStorage.getItem("userRole");

    // 1. PROTEÇÃO DE TELA: Se não houver usuário logado e a página não for de login ou cadastro, redireciona
    const paginasPublicas = ['login.html', 'cadastro.html', 'index.html', 'redefinir-senha.html'];
    const paginaAtual = window.location.pathname.split('/').pop() || 'index.html';

    if (!userRole && !paginasPublicas.includes(paginaAtual)) {
        window.location.href = "login.html";
        return;
    }

    // 2. CONTROLE DA SIDEBAR: Regras para o perfil ALUNO
    if (userRole === "ALUNO") {
        // Se o aluno tentar acessar páginas restritas a Administradores
        const paginasRestritas = ['home.html', 'cadastro-alunos.html', 'lista-alunos.html'];
        if (paginasRestritas.includes(paginaAtual)) {
            window.location.href = "agenda.html";
            return;
        }

        // Esconde os links do menu que pertencem ao Administrador
        const linksOcultar = [
            'a[href="home.html"]',
            'a[href="cadastro-alunos.html"]',
            'a[href="lista-alunos.html"]',
            'a[href="controle-acesso.html"]' // Se houver
        ];

        linksOcultar.forEach(seletor => {
            const link = document.querySelector(seletor);
            if (link) {
                const li = link.closest('li');
                if (li) {
                    li.style.display = 'none';
                }
            }
        });
    }
});


/* ============================================
   SHARED — localStorage, dados-semente, modal sair
   Importado por TODAS as páginas
   ============================================ */

const PowerGym = {
    ALUNOS_KEY: 'pg_alunos',
    AULAS_KEY: 'pg_aulas',
    ADMIN_KEY: 'pg_admin',
    VERSION_KEY: 'pg_seed_version',
    SEED_VERSION: 2,

    alunos() {
        return JSON.parse(localStorage.getItem(this.ALUNOS_KEY) || '[]');
    },
    setAlunos(arr) {
        localStorage.setItem(this.ALUNOS_KEY, JSON.stringify(arr));
    },

    aulas() {
        return JSON.parse(localStorage.getItem(this.AULAS_KEY) || '[]');
    },
    setAulas(arr) {
        localStorage.setItem(this.AULAS_KEY, JSON.stringify(arr));
    },

    admin() {
        return JSON.parse(localStorage.getItem(this.ADMIN_KEY) || 'null');
    },
    setAdmin(obj) {
        localStorage.setItem(this.ADMIN_KEY, JSON.stringify(obj));
    },

    contarAtivos() {
        return this.alunos().filter(a => a.ativo).length;
    },

    novoId() {
        return 'a_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7);
    },

    seed() {
        const versaoSalva = parseInt(localStorage.getItem(this.VERSION_KEY) || '0', 10);
        if (versaoSalva < this.SEED_VERSION) {
            localStorage.removeItem(this.AULAS_KEY);
            localStorage.setItem(this.VERSION_KEY, String(this.SEED_VERSION));
        }

        if (!localStorage.getItem(this.ALUNOS_KEY)) {
            this.setAlunos([
                { id: 'a1', nome: 'João Paulo Vieira', contato: '(11) 98255-2567', email: 'joao.paulo@email.com', genero: 'masculino', ativo: true },
                { id: 'a2', nome: 'Matheus Magalhães Moura', contato: '(11) 98255-2568', email: 'matheus@email.com', genero: 'masculino', ativo: true },
                { id: 'a3', nome: 'Pedro Henrique Gonçalves Bertanhi', contato: '(11) 98255-2569', email: 'pedro@email.com', genero: 'masculino', ativo: false },
                { id: 'a4', nome: 'David De Brito Alves', contato: '(11) 98255-2570', email: 'david@email.com', genero: 'masculino', ativo: true },
                { id: 'a5', nome: 'Felipe Anderson Anacleto Da Silva', contato: '(11) 98255-2571', email: 'felipe@email.com', genero: 'masculino', ativo: false }
            ]);
        }

        if (!localStorage.getItem(this.AULAS_KEY)) {
            this.setAulas([
                {
                    id: 'yoga',
                    nome: 'AULA DE YOGA',
                    duracao: 'YOGA 40 Min De Aula',
                    professor: 'Profª Beatriz Carvalho',
                    dia: 'Segunda',
                    horario: '14H30',
                    horarioFim: '15H10',
                    imagem: 'Yoga.png',
                    capacidade: 20,
                    agendados: [],
                    status: 'aberta',
                    proximas: ['Terça 07h00', 'Quarta 21h00']
                },
                {
                    id: 'boxe',
                    nome: 'AULA DE BOXE',
                    duracao: 'BOXE 40 Min De Aula',
                    professor: 'Profº Roberto Lima',
                    dia: 'Quarta',
                    horario: '19H30',
                    horarioFim: '20H10',
                    imagem: 'Boxe.jpg',
                    capacidade: 20,
                    agendados: Array.from({ length: 20 }, (_, i) => 'placeholder_' + i),
                    status: 'cheia',
                    proximas: ['Quinta 07h00', 'Segunda 21h00']
                },
                {
                    id: 'natacao',
                    nome: 'AULA DE NATAÇÃO',
                    duracao: 'NATAÇÃO 40 Min De Aula',
                    professor: 'Profª Michele Andrade',
                    dia: 'Quinta',
                    horario: '08H00',
                    horarioFim: '08H40',
                    imagem: 'natacao_02.png',
                    capacidade: 20,
                    agendados: [],
                    status: 'aberta',
                    proximas: ['Sexta 07h00', 'Sábado 21h00']
                },
                {
                    id: 'danca',
                    nome: 'AULA DE DANÇA',
                    duracao: 'DANÇA 40 Min De Aula',
                    professor: 'Profº João Paulo',
                    dia: 'Sexta',
                    horario: '20H05',
                    horarioFim: '20H45',
                    imagem: 'Danca.jpg',
                    capacidade: 20,
                    agendados: [],
                    status: 'cancelada',
                    proximas: ['Sábado 07h00', 'Sexta 21h00']
                }
            ]);
        }

        if (!localStorage.getItem(this.ADMIN_KEY)) {
            this.setAdmin({
                email: 'admin@powergymcenter.com',
                senha: 'admin123',
                nome: 'João Paulo'
            });
        }
    }
};

PowerGym.seed();

/* ============================================
   MODAL SAIR
   ============================================ */

function montarModalSair() {
    if (document.getElementById('modal-sair')) return;

    const modal = document.createElement('div');
    modal.id = 'modal-sair';
    modal.className = 'fundo-modal';
    modal.innerHTML = `
        <div class="caixa-modal">
            <button class="btn-fechar-modal" type="button" aria-label="Fechar"
                onclick="fecharModalSair()">
                <i class="fa-solid fa-circle-xmark"></i>
            </button>
            <h2 class="modal-sair-titulo">Deseja Sair?</h2>
            <p class="modal-sair-sub">Você Está Prestes A Fazer Logout.</p>
            <div class="modal-sair-botoes">
                <button class="btn-modal" type="button" onclick="confirmarSair()">Sim, Quero Sair!</button>
                <button class="btn-modal" type="button" onclick="fecharModalSair()">Não, Quero Ficar!</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    modal.addEventListener('click', (e) => {
        if (e.target === modal) fecharModalSair();
    });
}

function abrirModalSair() {
    montarModalSair();
    document.getElementById('modal-sair').classList.add('aberto');
}

function fecharModalSair() {
    const m = document.getElementById('modal-sair');
    if (m) m.classList.remove('aberto');
}

function confirmarSair() {
    // Quando confirmar a saída, é crucial limpar o sessionStorage!
    sessionStorage.removeItem("userName");
    sessionStorage.removeItem("userRole");
    sessionStorage.removeItem("userToken");
    window.location.href = 'login.html';
}

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-acao="sair"]').forEach(el => {
        el.addEventListener('click', (e) => {
            e.preventDefault();
            abrirModalSair();
        });
    });
});

/* ============================================
   POPUP DE SUCESSO (reutilizável)
   ============================================ */

function montarPopupSucesso() {
    if (document.getElementById('popup-sucesso')) return;

    const modal = document.createElement('div');
    modal.id = 'popup-sucesso';
    modal.className = 'fundo-modal';
    modal.innerHTML = `
        <div class="caixa-modal popup-sucesso">
            <button type="button" class="btn-fechar-modal" onclick="fecharPopupSucesso()" aria-label="Fechar">
                <i class="fa-solid fa-circle-xmark"></i>
            </button>
            <h2 class="popup-sucesso-titulo" hidden></h2>
            <div class="popup-sucesso-icone-wrap">
                <i class="popup-sucesso-icone fa-solid fa-circle-check"></i>
            </div>
            <p class="popup-sucesso-tag">Sucesso!</p>
        </div>
    `;
    document.body.appendChild(modal);

    modal.addEventListener('click', (e) => {
        if (e.target === modal) fecharPopupSucesso();
    });
}

let _popupSucessoTimer = null;

function mostrarPopupSucesso({ titulo, mensagem, icone, depois, duracao } = {}) {
    montarPopupSucesso();
    const m = document.getElementById('popup-sucesso');
    const elTitulo = m.querySelector('.popup-sucesso-titulo');
    const elIcone = m.querySelector('.popup-sucesso-icone');
    const elTag = m.querySelector('.popup-sucesso-tag');

    if (titulo) {
        elTitulo.innerText = titulo;
        elTitulo.hidden = false;
    } else {
        elTitulo.hidden = true;
    }
    elIcone.className = 'popup-sucesso-icone fa-solid ' + (icone || 'fa-circle-check');
    elTag.innerText = mensagem || 'Sucesso!';

    m.classList.add('aberto');

    if (_popupSucessoTimer) clearTimeout(_popupSucessoTimer);
    _popupSucessoTimer = setTimeout(() => {
        m.classList.remove('aberto');
        if (typeof depois === 'function') depois();
    }, duracao || 1800);
}

function fecharPopupSucesso() {
    if (_popupSucessoTimer) clearTimeout(_popupSucessoTimer);
    const m = document.getElementById('popup-sucesso');
    if (m) m.classList.remove('aberto');
}