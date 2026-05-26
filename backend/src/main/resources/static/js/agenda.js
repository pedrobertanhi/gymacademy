/* ============================================
   AGENDA — cards, modais, próximas aulas
   ============================================ */

const elBoasVindas = document.getElementById('boas-vindas');
const elLista = document.getElementById('lista-aulas');

const modalAgendar = document.getElementById('modal-agendar');
const modalSemVagas = document.getElementById('modal-sem-vagas');
const modalCancelado = document.getElementById('modal-cancelado');
const modalConfirmado = document.getElementById('modal-confirmado');

let aulaAtual = null;

function saudacaoAdmin() {
    const nomeSessao = sessionStorage.getItem("userName");
    const nome = nomeSessao ? nomeSessao.split(' ')[0] : 'Admin';
    elBoasVindas.innerText = `Olá, ${nome}!`;

    // Se for Aluno, mostra o botão de Check-in na Recepção
    const userRole = sessionStorage.getItem("userRole");
    if(userRole === "ALUNO") {
        document.getElementById('area-checkin-aluno').style.display = 'block';
    }
}

function rotuloStatus(status, agendados, capacidade) {
    if (status === 'cancelada') return { texto: 'Cancelado', classe: 'cancelada' };
    if (agendados >= capacidade || status === 'cheia') return { texto: 'Vagas Preenchidas', classe: 'cheia' };
    return { texto: 'Vagas Abertas', classe: 'aberta' };
}

function dataHoje() {
    const d = new Date();
    return d.toLocaleDateString('pt-BR');
}

function renderCards() {
    const aulas = PowerGym.aulas();
    elLista.innerHTML = aulas.map(a => {
        const ag = (a.agendados || []).length;
        const cap = a.capacidade || 20;
        const r = rotuloStatus(a.status, ag, cap);

        const proximas = (a.proximas || []).map(p => `
            <div class="proxima-aula">
                <i class="fa-solid fa-calendar-days"></i>
                <span><strong>${a.nome.replace('AULA DE ', 'AULA DE ')}</strong><br>${p}</span>
            </div>
        `).join('');

        // TAREFA 2: INSERÇÃO DO NOVO BOTÃO NO CARTÃO DA AULA
        return `
            <div class="class-card" data-id="${a.id}">
                <div class="card-header">
                    <i class="fa-solid fa-calendar-days"></i> ${a.nome}
                </div>
                <div class="card-body">
                    <p class="day">${a.dia}</p>
                    <h2 class="time">${a.horario}</h2>
                    
                    <div style="display: flex; flex-direction: column; gap: 8px;">
                        <button class="btn-agendar ${r.classe}" type="button" onclick="acaoAgendar('${a.id}')">Agendar</button>
                        
                        <button class="btn-ver-inscritos" type="button" style="background-color: #333; color: white; border-radius: 4px; padding: 6px; border: none; cursor: pointer; font-weight: bold; font-size: 0.9em;" onclick="verInscritos('${a.id}')">
                            <i class="fa-solid fa-users"></i> Ver Inscritos
                        </button>
                    </div>

                    <p class="professor" style="margin-top: 10px;">${a.professor}</p>
                    <p class="status ${r.classe}">${r.texto}</p>
                    ${r.classe !== 'aberta' ? `<p class="status-data">${dataHoje()}</p>` : ''}
                </div>
                <div class="card-footer">
                    <img src="assets/img/${a.imagem}" alt="${a.nome}" onerror="this.style.opacity='0.3'">
                    <button type="button" class="link-proximas" onclick="alternarProximas('${a.id}')">
                        Próximas Aulas
                    </button>
                    <div class="proximas-aulas" id="prox-${a.id}">
                        ${proximas}
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function alternarProximas(id) {
    const el = document.getElementById('prox-' + id);
    if (el) el.classList.toggle('aberto');
}

function acaoAgendar(id) {
    const aula = PowerGym.aulas().find(a => a.id === id);
    if (!aula) return;
    aulaAtual = aula;

    if (aula.status === 'cancelada') {
        abrirModal(modalCancelado);
        return;
    }
    const ag = (aula.agendados || []).length;
    if (ag >= aula.capacidade) {
        document.getElementById('sv-info').innerText = aula.duracao;
        document.getElementById('sv-horario').innerText =
            `${aula.dia.toUpperCase()} ${aula.horario} - ${aula.horarioFim}`;
        abrirModal(modalSemVagas);
        return;
    }

    document.getElementById('ag-info').innerText = aula.duracao;
    document.getElementById('ag-horario').innerText =
        `${aula.dia.toUpperCase()} ${aula.horario} - ${aula.horarioFim}`;
    document.getElementById('form-agendar').reset();
    document.getElementById('ag-erro').hidden = true;
    fecharSugestoes();
    abrirModal(modalAgendar);
}

/* ===== Autocomplete: ao digitar nome, sugere alunos cadastrados ===== */

const elNome = document.getElementById('ag-nome');
const elContato = document.getElementById('ag-contato');
const elEmail = document.getElementById('ag-email');
const elSugestoes = document.getElementById('ag-sugestoes');

function renderSugestoes(termo) {
    const t = (termo || '').trim().toLowerCase();
    if (!t || t.length < 1) {
        fecharSugestoes();
        return;
    }
    // Agora puxa os alunos do SessionStorage ou API se fossemos fazer real.
    // Para agendamento, o código antigo PowerGym ainda funciona local.
    const lista = PowerGym.alunos()
        .filter(a => a.nome.toLowerCase().includes(t))
        .slice(0, 6);
    if (!lista.length) {
        fecharSugestoes();
        return;
    }
    elSugestoes.innerHTML = lista.map(a => `
        <div class="sugestao-item" data-id="${a.id}">
            <i class="fa-solid fa-circle-user"></i>
            <div>
                <div class="sugestao-nome">${a.nome}</div>
                <div class="sugestao-tel">+55 ${a.contato}</div>
            </div>
        </div>
    `).join('');
    elSugestoes.hidden = false;
}

function fecharSugestoes() {
    elSugestoes.hidden = true;
    elSugestoes.innerHTML = '';
}

function preencherDeAluno(id) {
    const a = PowerGym.alunos().find(x => x.id === id);
    if (!a) return;
    elNome.value = a.nome;
    elContato.value = a.contato || '';
    elEmail.value = a.email || '';
    fecharSugestoes();
}

if(elNome) {
    elNome.addEventListener('input', () => renderSugestoes(elNome.value));
    elNome.addEventListener('focus', () => renderSugestoes(elNome.value));
}

if(elSugestoes) {
    elSugestoes.addEventListener('click', (e) => {
        const item = e.target.closest('.sugestao-item');
        if (item) preencherDeAluno(item.dataset.id);
    });
}

document.addEventListener('click', (e) => {
    if (elNome && !elNome.contains(e.target) && elSugestoes && !elSugestoes.contains(e.target)) {
        fecharSugestoes();
    }
});

const formAgendar = document.getElementById('form-agendar');
if(formAgendar) {
    formAgendar.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Pega os dados de quem está logado!
        const nomeSessao = sessionStorage.getItem("userName");

        // Mantém a leitura dos campos do formulário para caso seja o Admin a marcar por alguém
        const nomeForm = document.getElementById('ag-nome').value.trim();
        const contatoForm = document.getElementById('ag-contato').value.trim();
        const emailForm = document.getElementById('ag-email').value.trim();
        const erro = document.getElementById('ag-erro');

        // Usa o nome da sessão se for o aluno, ou o do formulário se o aluno tiver preenchido
        const nomeFinal = nomeSessao || nomeForm;

        if (!nomeFinal) {
            erro.textContent = 'Erro ao identificar o aluno.';
            erro.hidden = false;
            return;
        }

        if (!aulaAtual) return;
        const aulas = PowerGym.aulas();
        const idx = aulas.findIndex(a => a.id === aulaAtual.id);
        if (idx === -1) return;

        // Salva no LocalStorage do PowerGym
        aulas[idx].agendados = aulas[idx].agendados || [];
        aulas[idx].agendados.push({
            nome: nomeFinal,
            contato: contatoForm || 'Não informado',
            email: emailForm || 'Não informado',
            em: Date.now()
        });

        if (aulas[idx].agendados.length >= aulas[idx].capacidade) {
            aulas[idx].status = 'cheia';
        }
        PowerGym.setAulas(aulas);

        fecharModais();
        abrirModal(modalConfirmado);
        renderCards();
    });
}

function abrirModal(m) {
    fecharModais();
    m.classList.add('aberto');
}

function fecharModais() {
    [modalAgendar, modalSemVagas, modalCancelado, modalConfirmado]
        .forEach(m => m && m.classList.remove('aberto'));
}

[modalAgendar, modalSemVagas, modalCancelado, modalConfirmado].forEach(m => {
    if (!m) return;
    m.addEventListener('click', (e) => {
        if (e.target === m) fecharModais();
    });
});

/* ============================================
   FUNÇÕES NOVAS (CHECK-IN E LISTA DE INSCRITOS)
   ============================================ */

// TAREFA 1: Check-in Virtual do Aluno
async function solicitarCheckin() {
    const userId = sessionStorage.getItem("userId");
    if (!userId) {
        alert("Erro: Faça login novamente para identificar o seu cadastro.");
        return;
    }

    try {
        const response = await fetch(`http://localhost:8081/api/catraca/solicitar/${userId}`, { method: 'POST' });
        if (response.ok) {
            if(typeof mostrarPopupSucesso === 'function') {
                mostrarPopupSucesso({
                    titulo: 'Catraca Avisada!',
                    mensagem: 'Aguarde a recepção liberar sua entrada.',
                    icone: 'fa-bell'
                });
            } else {
                alert("A recepção foi avisada. Aguarde a liberação da catraca.");
            }
        }
    } catch (error) {
        console.error("Erro no check-in:", error);
    }
}

// TAREFA 2: Ver a lista de Inscritos da Aula
async function verInscritos(aulaId) {
    const userRole = sessionStorage.getItem("userRole");

    // Bloqueia se for Aluno
    if (userRole !== "ADMIN") {
        alert("Acesso Negado: Apenas os administradores podem visualizar a lista de alunos inscritos.");
        return;
    }

    try {
        // Puxa a lista diretamente do LocalStorage (onde o Agendamento está a ser salvo)
        let inscritos = [];
        const aulaLocal = PowerGym.aulas().find(a => a.id === aulaId);

        if(aulaLocal && aulaLocal.agendados) {
            // Se o objeto tiver { nome: 'Pedro' }, pega o nome. Se for só string 'placeholder_0', pega a string.
            inscritos = aulaLocal.agendados.map(ag => typeof ag === 'object' ? ag.nome : ag);
        }

        const ulHtml = document.getElementById('lista-inscritos-html');
        if(!ulHtml) return;

        ulHtml.innerHTML = inscritos.length === 0
            ? '<li style="text-align: center; color: #999;">Nenhum aluno agendou esta aula.</li>'
            : inscritos.map(nome =>
                `<li style="padding: 10px; border-bottom: 1px solid #eee;">
                    <i class="fa-solid fa-user" style="color: #666; margin-right: 10px;"></i> ${nome}
                </li>`
            ).join('');

        document.getElementById('modal-inscritos-aula').classList.add('aberto');

    } catch (error) {
        console.error("Erro ao mostrar inscritos:", error);
    }
}

/* ===== Inicialização ===== */
saudacaoAdmin();
renderCards();