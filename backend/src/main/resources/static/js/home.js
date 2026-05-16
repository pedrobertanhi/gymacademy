/* ============================================
   HOME — boas-vindas, lotação, busca, lista, catraca
   ============================================ */

const elBoasVindas = document.getElementById('boas-vindas');
const elLotacao = document.getElementById('lotacao-atual');
const elLista = document.getElementById('lista-alunos');
const elBusca = document.getElementById('busca-aluno');

const modalCatraca = document.getElementById('modal-catraca');
const tituloCatraca = document.getElementById('modal-catraca-titulo');
const botoesCatraca = document.getElementById('modal-catraca-botoes');
const iconeCatraca = document.getElementById('modal-catraca-icone');
const corpoCatraca = document.getElementById('modal-catraca-corpo');

function saudacaoAdmin() {
    const admin = PowerGym.admin();
    const nome = admin && admin.nome ? admin.nome.split(' ')[0] : 'Admin';
    elBoasVindas.innerText = `Bem-Vindo, ${nome}!`;
}

function atualizarLotacao() {
    elLotacao.innerText = PowerGym.contarAtivos();
}

function normalizarTelefone(s) {
    return (s || '').replace(/\D/g, '');
}

function alunosFiltrados(termo) {
    const t = (termo || '').trim().toLowerCase();
    const tNum = normalizarTelefone(termo);
    const todos = PowerGym.alunos();
    if (!t) return todos;
    return todos.filter(a => {
        const nomeMatch = a.nome.toLowerCase().includes(t);
        const telMatch = tNum && normalizarTelefone(a.contato).includes(tNum);
        return nomeMatch || telMatch;
    });
}

function renderLista(termo) {
    const lista = alunosFiltrados(termo);
    if (!lista.length) {
        elLista.innerHTML = '<div class="lista-vazia">Nenhum aluno encontrado.</div>';
        return;
    }
    elLista.innerHTML = lista.map(a => `
        <div class="linha-aluno" data-id="${a.id}">
            <div class="info-aluno">
                <i class="fa-solid fa-circle-user icone-aluno"></i>
                <div class="textos-aluno">
                    <h4>${a.nome}</h4>
                    <p>+55 ${a.contato}</p>
                </div>
            </div>
            <button class="btn-catraca ${a.ativo ? 'ativo' : 'inativo'}"
                    type="button"
                    onclick="abrirModalCatraca(${a.ativo})">
                <i class="fa-solid fa-check"></i> Liberar Catraca
            </button>
            <span class="status-aluno ${a.ativo ? 'status-ativo' : 'status-inativo'}">
                ${a.ativo ? 'Ativo' : 'Inativo'}
            </span>
        </div>
    `).join('');
}

elBusca.addEventListener('input', () => renderLista(elBusca.value));

/* ===== Modal catraca ===== */

function abrirModalCatraca(alunoAtivo) {
    modalCatraca.classList.add('aberto');

    if (alunoAtivo) {
        tituloCatraca.innerText = 'Liberar Catraca';
        tituloCatraca.style.textAlign = 'left';
        botoesCatraca.style.display = 'flex';
        iconeCatraca.className = 'fa-solid fa-lock';
        iconeCatraca.style.color = 'white';
        corpoCatraca.style.justifyContent = 'space-between';
    } else {
        tituloCatraca.innerText = 'Aluno Inativo';
        tituloCatraca.style.textAlign = 'center';
        botoesCatraca.style.display = 'none';
        iconeCatraca.className = 'fa-solid fa-user';
        iconeCatraca.style.color = '#777';
        corpoCatraca.style.justifyContent = 'center';
    }
}

function confirmarLiberacao() {
    tituloCatraca.innerText = 'Liberado!';
    tituloCatraca.style.textAlign = 'center';
    botoesCatraca.style.display = 'none';
    iconeCatraca.className = 'fa-solid fa-lock-open';
    iconeCatraca.style.color = 'white';
    corpoCatraca.style.justifyContent = 'center';
    setTimeout(fecharModalCatraca, 2000);
}

function fecharModalCatraca() {
    modalCatraca.classList.remove('aberto');
}

modalCatraca.addEventListener('click', (e) => {
    if (e.target === modalCatraca) fecharModalCatraca();
});

/* ===== Bootstrap ===== */
saudacaoAdmin();
atualizarLotacao();
renderLista('');
