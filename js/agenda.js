let aulaSelecionada = "";
const modal = document.getElementById('fundo-modal');
const container = document.getElementById('conteudo-dinamico-modal');

function abrirAgendamento(aula, horario) {
    aulaSelecionada = aula;
    container.innerHTML = `
        <h2 style="margin-bottom:20px; text-align:left">Meu Agendamento:</h2>
        <div style="display:flex; gap:20px; align-items:center; text-align:left">
            <div style="flex:1">
                <input type="text" id="nome-aluno" class="input-gym" placeholder="Nome Aluno">
                <input type="text" id="contato-aluno" class="input-gym" placeholder="Contato">
                <p style="margin-top:15px"><strong>${aula.toUpperCase()}</strong></p>
                <p style="font-size:12px; opacity:0.8">${horario}</p>
            </div>
            <i class="fa-solid fa-calendar-check" style="font-size:70px"></i>
        </div>
        <button class="btn-modal" style="margin-top:20px" onclick="finalizar()">Agendar Agora!</button>
    `;
    modal.style.display = 'flex';
}

function finalizar() {
    const nome = document.getElementById('nome-aluno').value;
    if(!nome) return alert("Digite o nome do aluno");

    if(aulaSelecionada === "Musculação") {
        renderStatus('Sem Vagas!', 'fa-calendar-xmark', 'Infelizmente não há vagas.');
    } else {
        renderStatus('Confirmado!', 'fa-circle-check', 'Aula agendada com sucesso!');
    }
}

function renderStatus(titulo, icone, msg) {
    container.innerHTML = `
        <h2>${titulo}</h2>
        <i class="fa-solid ${icone}" style="font-size:80px; margin:20px 0"></i>
        <p>${msg}</p>
        <button class="btn-modal" style="margin-top:20px" onclick="fecharModal()">Fechar</button>
    `;
}

function fecharModal() { modal.style.display = 'none'; }

window.onclick = (e) => { if(e.target == modal) fecharModal(); }    