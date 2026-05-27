/* ============================================
   ATUALIZAR CADASTRO (ADMIN)
   ============================================ */

const elBuscaModal = document.getElementById('busca-modal'); // Input de busca dentro do modal
const elResultadosModal = document.getElementById('resultados-busca'); // Onde os resultados aparecem no modal
const elLista = document.getElementById('lista-alunos');
const modalBusca = document.getElementById('modal-busca'); // O modal que trava a tela

let alunosReais = [];

// 1. Busca todos os alunos no H2 ao abrir a tela
async function carregarAlunosParaAtualizar() {
    try {
        const response = await fetch("http://localhost:8081/api/alunos");
        if (response.ok) {
            alunosReais = await response.json();
            // Inicia o Modal de Busca com todos os alunos ou vazio
            renderBuscaModal('');
        }
    } catch (error) {
        console.error("Erro ao puxar alunos:", error);
        if(elResultadosModal) {
            elResultadosModal.innerHTML = '<div class="lista-vazia">Erro ao conectar com o banco.</div>';
        }
    }
}

function normalizarTelefone(s) {
    return (s || '').replace(/\D/g, '');
}

function alunosFiltrados(termo) {
    const t = (termo || '').trim().toLowerCase();
    const tNum = normalizarTelefone(termo);
    if (!t) return alunosReais;
    return alunosReais.filter(a => {
        const nomeMatch = a.nome.toLowerCase().includes(t);
        const telMatch = tNum && normalizarTelefone(a.contato).includes(tNum);
        return nomeMatch || telMatch;
    });
}

// 2. Controla o Modal de Busca que abre no início (O SEU HTML ORIGINAL)
function renderBuscaModal(termo) {
    if(!elResultadosModal) return;

    const lista = alunosFiltrados(termo);
    if (!lista.length) {
        elResultadosModal.innerHTML = '<div class="lista-vazia">Nenhum aluno encontrado.</div>';
        return;
    }
    elResultadosModal.innerHTML = lista.map(a => `
        <div class="linha-aluno" style="cursor: pointer; padding: 10px; border-bottom: 1px solid #eee;" onclick="selecionarAlunoParaEditar('${a.id}')">
            <div class="info-aluno">
                <i class="fa-solid fa-circle-user icone-aluno" style="color: #666; margin-right: 10px;"></i>
                <div class="textos-aluno" style="display: inline-block;">
                    <h4 style="margin: 0; color: #333;">${a.nome}</h4>
                    <p style="margin: 0; font-size: 0.85em; color: #777;">+55 ${a.contato || 'N/A'}</p>
                </div>
            </div>
            <span class="status-aluno ${a.ativo ? 'status-ativo' : 'status-inativo'}" style="float: right;">
                ${a.ativo ? 'Ativo' : 'Inativo'}
            </span>
        </div>
    `).join('');
}

// Quando digita no Modal
if (elBuscaModal) {
    elBuscaModal.addEventListener('input', () => renderBuscaModal(elBuscaModal.value));
}

// 3. A Função Mágica que Desbloqueia a Tela!
function cancelarBusca() {
    if(modalBusca) {
        modalBusca.classList.remove('aberto');
    }
    // Se cancelar a busca, volta para o menu principal para não ficar na tela preta
    window.location.href = 'home.html';
}

function selecionarAlunoParaEditar(id) {
    const aluno = alunosReais.find(a => String(a.id) === String(id));
    if (!aluno) return;

    // Fecha o modal de busca
    if(modalBusca) modalBusca.classList.remove('aberto');

    // Preenche o formulário lá atrás (O formulário da página principal)
    document.getElementById('area-form').hidden = false;
    document.getElementById('aluno-id-display').textContent = `#${aluno.id}`;

    document.getElementById('up-nome').value = aluno.nome;
    document.getElementById('up-contato').value = aluno.contato || '';
    document.getElementById('up-email').value = aluno.email || '';
    document.getElementById('up-senha').value = ''; // Senha vem vazia por segurança
}

// 4. O Formulário de Atualização (Simulado, como o professor pediu)
const formAtualizar = document.getElementById('form-atualizar');
if (formAtualizar) {
    formAtualizar.addEventListener('submit', (e) => {
        e.preventDefault();

        mostrarPopupSucesso({
            titulo: 'Atualizado!',
            mensagem: 'Dados do aluno foram salvos.',
            icone: 'fa-check',
            depois: () => { window.location.href = 'home.html'; }
        });
    });
}

// Para o "olho" da senha funcionar no form de atualização
function alternarVisSenha(idCampo, icone) {
    const campo = document.getElementById(idCampo);
    if (!campo) return;
    if (campo.type === 'password') {
        campo.type = 'text';
        icone.classList.remove('fa-eye');
        icone.classList.add('fa-eye-slash');
    } else {
        campo.type = 'password';
        icone.classList.remove('fa-eye-slash');
        icone.classList.add('fa-eye');
    }
}

// Inicializa a tela puxando do banco de verdade
document.addEventListener("DOMContentLoaded", () => {
    carregarAlunosParaAtualizar();
});