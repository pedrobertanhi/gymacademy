/* ============================================
   ATUALIZAR CADASTRO — modal de busca + form
   ============================================ */

const elBoasVindas = document.getElementById('boas-vindas');
const adminAtual = PowerGym.admin();
elBoasVindas.innerText = `Bem-Vindo, ${adminAtual?.nome?.split(' ')[0] || 'Admin'}!`;

const modalBusca = document.getElementById('modal-busca');
const inputBusca = document.getElementById('busca-modal');
const resultados = document.getElementById('resultados-busca');
const areaForm = document.getElementById('area-form');

let alunoSelecionado = null;

function normalizarTelefone(s) {
    return (s || '').replace(/\D/g, '');
}

function buscar(termo) {
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

function renderResultados(termo) {
    const lista = buscar(termo);
    if (!lista.length) {
        resultados.innerHTML = '<div class="resultado-vazio">Nenhum aluno encontrado.</div>';
        return;
    }
    resultados.innerHTML = lista.map(a => `
        <div class="resultado-item" onclick="selecionarAluno('${a.id}')">
            <i class="fa-solid fa-circle-user"></i>
            <div>
                <div class="resultado-item-nome">${a.nome}</div>
                <div class="resultado-item-tel">+55 ${a.contato}</div>
            </div>
        </div>
    `).join('');
}

inputBusca.addEventListener('input', () => renderResultados(inputBusca.value));
renderResultados('');

function cancelarBusca() {
    if (!alunoSelecionado) {
        window.location.href = 'cadastro-alunos.html';
        return;
    }
    modalBusca.classList.remove('aberto');
}

function selecionarAluno(id) {
    const a = PowerGym.alunos().find(x => x.id === id);
    if (!a) return;
    alunoSelecionado = a;

    document.getElementById('aluno-id-display').innerText = `ID: ${a.id}`;
    document.getElementById('up-nome').value = a.nome || '';
    document.getElementById('up-email').value = a.email || '';
    document.getElementById('up-senha').value = '';
    document.getElementById('up-contato').value = a.contato || '';
    const radioG = document.querySelector(`input[name="up-genero"][value="${a.genero || 'masculino'}"]`);
    if (radioG) radioG.checked = true;
    const radioN = document.querySelector(`input[name="up-notif"][value="${a.notificacoes || 'todos'}"]`);
    if (radioN) radioN.checked = true;

    modalBusca.classList.remove('aberto');
    areaForm.hidden = false;
}

/* ===== Form ===== */

function alternarVisSenha(id, icone) {
    const c = document.getElementById(id);
    if (c.type === 'password') {
        c.type = 'text';
        icone.classList.remove('fa-eye'); icone.classList.add('fa-eye-slash');
    } else {
        c.type = 'password';
        icone.classList.remove('fa-eye-slash'); icone.classList.add('fa-eye');
    }
}

function mascararContato(valor) {
    let v = valor.replace(/\D/g, '').slice(0, 11);
    if (v.length === 0) return '';
    if (v.length <= 2) return `(${v}`;
    if (v.length <= 6) return `(${v.slice(0, 2)}) ${v.slice(2)}`;
    if (v.length <= 10) return `(${v.slice(0, 2)}) ${v.slice(2, 6)}-${v.slice(6)}`;
    return `(${v.slice(0, 2)}) ${v.slice(2, 7)}-${v.slice(7)}`;
}

document.getElementById('up-contato').addEventListener('input', (e) => {
    e.target.value = mascararContato(e.target.value);
});

document.getElementById('form-atualizar').addEventListener('submit', (e) => {
    e.preventDefault();
    if (!alunoSelecionado) return;

    const erro = document.getElementById('erro-up');
    const nome = document.getElementById('up-nome').value.trim();
    const email = document.getElementById('up-email').value.trim();
    const senha = document.getElementById('up-senha').value;
    const contato = document.getElementById('up-contato').value.trim();
    const genero = document.querySelector('input[name="up-genero"]:checked')?.value || 'nenhum';
    const notif = document.querySelector('input[name="up-notif"]:checked')?.value || 'todos';

    if (!nome || !email || !contato) {
        erro.textContent = 'Preencha todos os campos obrigatórios.';
        erro.hidden = false;
        return;
    }

    const todos = PowerGym.alunos();
    const idx = todos.findIndex(a => a.id === alunoSelecionado.id);
    if (idx === -1) return;

    todos[idx] = {
        ...todos[idx],
        nome, email, contato, genero,
        notificacoes: notif
    };
    if (senha && senha.length >= 6) todos[idx].senha = senha;
    PowerGym.setAlunos(todos);

    mostrarPopupSucesso({
        titulo: 'Cadastro Atualizado!',
        mensagem: 'Alterações Salvas Com Sucesso',
        icone: 'fa-circle-check',
        depois: () => { window.location.href = 'cadastro-alunos.html'; }
    });
});
