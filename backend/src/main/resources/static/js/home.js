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

let alunoSelecionadoId = null;
let alunosDoBanco = [];

function saudacaoAdmin() {
    const nomeSessao = sessionStorage.getItem("userName");
    const nome = nomeSessao ? nomeSessao.split(' ')[0] : 'Admin';
    elBoasVindas.innerText = `Bem-Vindo, ${nome}!`;
}

async function carregarDados() {
    try {
        const response = await fetch("http://localhost:8081/api/alunos");
        if(response.ok) {
            alunosDoBanco = await response.json();
            atualizarLotacao();
            renderLista('');
        }
    } catch(e) {
        console.error("Erro ao buscar alunos reais:", e);
    }
}

function atualizarLotacao() {
    elLotacao.innerText = alunosDoBanco.filter(a => a.ativo).length;
}

function normalizarTelefone(s) {
    return (s || '').replace(/\D/g, '');
}

function alunosFiltrados(termo) {
    const t = (termo || '').trim().toLowerCase();
    const tNum = normalizarTelefone(termo);
    if (!t) return alunosDoBanco;
    return alunosDoBanco.filter(a => {
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
                    <p>+55 ${a.contato || 'Não informado'}</p>
                </div>
            </div>
            <button class="btn-catraca ${a.ativo ? 'ativo' : 'inativo'}"
                    type="button"
                    onclick="abrirModalCatraca(${a.ativo}, ${a.id})">
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

function abrirModalCatraca(alunoAtivo, idAluno) {
    alunoSelecionadoId = idAluno;
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

async function confirmarLiberacao() {
    tituloCatraca.innerText = 'Liberado';
    tituloCatraca.style.textAlign = 'center';
    botoesCatraca.style.display = 'none';
    iconeCatraca.className = 'fa-solid fa-lock-open';
    iconeCatraca.style.color = '#4CAF50';
    corpoCatraca.style.justifyContent = 'center';

    if(alunoSelecionadoId) {
        try {
            // Repare no ?aprovado=true no final da URL
            await fetch(`http://localhost:8081/api/catraca/liberar/${alunoSelecionadoId}?aprovado=true`, {
                method: "POST"
            });
            carregarAcessosRecentes();
        } catch(e) { console.error("Erro na catraca:", e); }
    }
    setTimeout(fecharModalCatraca, 2000);
}

async function negarLiberacao() {
    tituloCatraca.innerText = 'Não Liberado';
    tituloCatraca.style.textAlign = 'center';
    botoesCatraca.style.display = 'none';
    iconeCatraca.className = 'fa-solid fa-lock';
    iconeCatraca.style.color = '#f44336';
    corpoCatraca.style.justifyContent = 'center';

    if(alunoSelecionadoId) {
        try {
            // Repare no ?aprovado=false no final da URL
            await fetch(`http://localhost:8081/api/catraca/liberar/${alunoSelecionadoId}?aprovado=false`, {
                method: "POST"
            });
            carregarAcessosRecentes();
        } catch(e) { console.error("Erro na catraca:", e); }
    }
    setTimeout(fecharModalCatraca, 2000);
}

function fecharModalCatraca() {
    modalCatraca.classList.remove('aberto');
    alunoSelecionadoId = null;
}

modalCatraca.addEventListener('click', (e) => {
    if (e.target === modalCatraca) fecharModalCatraca();
});

/* ============================================
   RADAR DE FILA E HISTÓRICO (TAREFA 1 E BOTÃO CHECKIN)
   ============================================ */

// Função que carrega o histórico de acessos
async function carregarAcessosRecentes() {
    const listaHtml = document.getElementById('lista-acessos-recentes');
    if(!listaHtml) return;

    try {
        const response = await fetch("http://localhost:8081/api/catraca/recentes");
        if(response.ok) {
            const acessos = await response.json();
            if(acessos.length === 0) {
                listaHtml.innerHTML = '<div class="lista-vazia">Nenhum acesso registrado hoje.</div>';
                return;
            }

            listaHtml.innerHTML = acessos.map(acesso => {
                const hora = new Date(acesso.momento).toLocaleTimeString();
                const corStatus = acesso.liberado ? 'status-ativo' : 'status-inativo'; // Reutilizando suas cores CSS

                return `
                    <div class="linha-aluno" style="cursor: default;">
                        <div class="info-aluno">
                            <i class="fa-solid fa-clock-rotate-left icone-aluno" style="color: #666;"></i>
                            <div class="textos-aluno">
                                <h4>${acesso.nomeAluno}</h4>
                                <p>${hora}</p>
                            </div>
                        </div>
                        <span class="status-aluno ${corStatus}">
                            ${acesso.liberado ? 'Acesso Liberado' : 'Acesso Negado'}
                        </span>
                    </div>
                `;
            }).join('');
        }
    } catch (error) {
        console.error("Erro ao carregar histórico:", error);
        listaHtml.innerHTML = '<div class="lista-vazia">Erro ao carregar os dados.</div>';
    }
}

// O Radar que verifica se alguém apertou o botão "Check-in"
setInterval(async () => {
    try {
        const response = await fetch("http://localhost:8081/api/catraca/pendente");
        if (response.status === 200) {
            const aluno = await response.json();
            if (aluno && !modalCatraca.classList.contains('aberto')) {
                tituloCatraca.innerText = `Check-in Solicitado: ${aluno.nome}`;
                abrirModalCatraca(aluno.ativo, aluno.id);
            }
        }
    } catch (error) { /* Silêncio */ }
}, 3000);

/* ===== Inicialização ===== */
saudacaoAdmin();
carregarDados();
carregarAcessosRecentes();