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
    const admin = PowerGym.admin();
    const nome = admin && admin.nome ? admin.nome.split(' ')[0] : 'Admin';
    elBoasVindas.innerText = `Bem-Vindo, ${nome}!`;
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

        return `
            <div class="class-card" data-id="${a.id}">
                <div class="card-header">
                    <i class="fa-solid fa-calendar-days"></i> ${a.nome}
                </div>
                <div class="card-body">
                    <p class="day">${a.dia}</p>
                    <h2 class="time">${a.horario}</h2>
                    <button class="btn-agendar ${r.classe}" type="button" onclick="acaoAgendar('${a.id}')">Agendar</button>
                    <p class="professor">${a.professor}</p>
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

elNome.addEventListener('input', () => renderSugestoes(elNome.value));
elNome.addEventListener('focus', () => renderSugestoes(elNome.value));

elSugestoes.addEventListener('click', (e) => {
    const item = e.target.closest('.sugestao-item');
    if (item) preencherDeAluno(item.dataset.id);
});

document.addEventListener('click', (e) => {
    if (!elNome.contains(e.target) && !elSugestoes.contains(e.target)) {
        fecharSugestoes();
    }
});

document.getElementById('form-agendar').addEventListener('submit', (e) => {
    e.preventDefault();
    const nome = document.getElementById('ag-nome').value.trim();
    const contato = document.getElementById('ag-contato').value.trim();
    const email = document.getElementById('ag-email').value.trim();
    const erro = document.getElementById('ag-erro');

    if (!nome || !contato || !email) {
        erro.textContent = 'Preencha todos os campos.';
        erro.hidden = false;
        return;
    }
    if (!aulaAtual) return;

    const aulas = PowerGym.aulas();
    const idx = aulas.findIndex(a => a.id === aulaAtual.id);
    if (idx === -1) return;

    aulas[idx].agendados = aulas[idx].agendados || [];
    aulas[idx].agendados.push({ nome, contato, email, em: Date.now() });
    if (aulas[idx].agendados.length >= aulas[idx].capacidade) {
        aulas[idx].status = 'cheia';
    }
    PowerGym.setAulas(aulas);

    fecharModais();
    abrirModal(modalConfirmado);
    renderCards();
});

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

/* ===== Bootstrap ===== */
saudacaoAdmin();
renderCards();
