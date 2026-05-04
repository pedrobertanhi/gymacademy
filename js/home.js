// Lógica de filtro/busca de alunos
document.getElementById('busca-aluno').addEventListener('keyup', function() {
    let termoBusca = this.value.toLowerCase();
    let linhasAlunos = document.querySelectorAll('.linha-aluno');

    linhasAlunos.forEach(function(linha) {
        let nomeAluno = linha.querySelector('.textos-aluno h4').innerText.toLowerCase();
        
        if (nomeAluno.includes(termoBusca)) {
            linha.style.display = 'flex';
        } else {
            linha.style.display = 'none';
        }
    });
});

// ================= LÓGICA DO MODAL =================

// Elementos do Modal
const fundoModal = document.getElementById('fundo-modal');
const tituloModal = document.getElementById('titulo-modal');
const botoesModal = document.getElementById('botoes-modal');
const iconeEstado = document.getElementById('icone-estado');
const corpoModal = document.getElementById('corpo-modal');

// Função para abrir o modal de acordo com o status do aluno (true = Ativo, false = Inativo)
function abrirModalCatraca(alunoAtivo) {
    fundoModal.style.display = 'flex'; // Mostra o modal

    if (alunoAtivo) {
        // Estado 1: Confirmar Liberação (Cadeado Fechado)
        tituloModal.innerText = 'Liberar Catraca';
        tituloModal.style.textAlign = 'left';
        botoesModal.style.display = 'flex';
        iconeEstado.className = 'fa-solid fa-lock';
        iconeEstado.style.color = 'white';
        corpoModal.style.justifyContent = 'space-between';
    } else {
        // Estado 2: Aluno Inativo (Ícone de Usuário Cinza)
        tituloModal.innerText = 'Aluno Inativo';
        tituloModal.style.textAlign = 'center';
        botoesModal.style.display = 'none'; // Esconde os botões Sim/Não
        iconeEstado.className = 'fa-solid fa-user';
        iconeEstado.style.color = '#777'; // Cor cinza escuro
        corpoModal.style.justifyContent = 'center'; // Centraliza o ícone
    }
}

// Função para quando clica no botão "Sim"
function confirmarLiberacao() {
    // Estado 3: Liberado! (Cadeado Aberto)
    tituloModal.innerText = 'Liberado!';
    tituloModal.style.textAlign = 'center';
    botoesModal.style.display = 'none'; // Esconde os botões Sim/Não
    iconeEstado.className = 'fa-solid fa-lock-open'; // Cadeado aberto
    corpoModal.style.justifyContent = 'center';

    // Fecha o modal automaticamente após 2 segundos
    setTimeout(fecharModal, 2000);
}

// Função para fechar o modal
function fecharModal() {
    fundoModal.style.display = 'none';
}

// Fecha o modal se o usuário clicar no fundo semi-transparente (fora da caixa azul)
window.onclick = function(event) {
    if (event.target === fundoModal) {
        fecharModal();
    }
}