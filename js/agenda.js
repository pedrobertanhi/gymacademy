let dataBase = new Date();
let aulas = [
    { id: 1, data: '2024-11-15', titulo: 'Aula Experimental', inicio: '14:00', fim: '15:00', cor: '#33cc33' },
    { id: 2, data: '2024-11-15', titulo: 'Treino Força', inicio: '18:00', fim: '19:30', cor: '#ff9900' }
];

let dataClicada = "";
let idSelecionado = null;

document.addEventListener('DOMContentLoaded', montarCalendario);

function montarCalendario() {
    const grid = document.getElementById('calendario-grid');
    const labelMes = document.getElementById('mes-ano-atual');
    grid.innerHTML = "";

    const mes = dataBase.getMonth();
    const ano = dataBase.getFullYear();
    labelMes.innerText = dataBase.toLocaleString('pt-BR', { month: 'long', year: 'numeric' });

    const inicioMes = new Date(ano, mes, 1).getDay();
    const diasMes = new Date(ano, mes + 1, 0).getDate();

    for (let i = 0; i < inicioMes; i++) grid.innerHTML += '<div class="dia dia-vazio"></div>';

    for (let d = 1; d <= diasMes; d++) {
        const dataStr = `${ano}-${String(mes + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
        const hoje = new Date();
        const ehHoje = d === hoje.getDate() && mes === hoje.getMonth() && ano === hoje.getFullYear();
        
        const aulasDoDia = aulas.filter(a => a.data === dataStr);
        const htmlTags = aulasDoDia.map(a => `<div class="evento-mini" style="background:${a.cor}">${a.inicio} - ${a.titulo}</div>`).join('');

        grid.innerHTML += `
            <div class="dia ${ehHoje ? 'dia-hoje' : ''}" onclick="abrirDia('${dataStr}')">
                <div class="num">${d}</div>
                ${htmlTags}
            </div>
        `;
    }
}

function mudarMes(v) { dataBase.setMonth(dataBase.getMonth() + v); montarCalendario(); }

function abrirDia(data) {
    dataClicada = data;
    const [a, m, d] = data.split('-');
    document.getElementById('data-aulas-txt').innerText = `${d}/${m}/${a}`;
    
    const lista = document.getElementById('lista-aulas');
    const filtradas = aulas.filter(a => a.data === data);
    
    lista.innerHTML = filtradas.length ? filtradas.map(a => `
        <div class="item-aula" onclick="abrirDetalhe(${a.id})">
            <span>${a.inicio} - ${a.titulo}</span>
            <i class="fa-solid fa-chevron-right"></i>
        </div>
    `).join('') : '<p style="text-align:center">Nenhuma aula.</p>';

    document.getElementById('modal-lista').style.display = 'flex';
}

function abrirDetalhe(id) {
    idSelecionado = id;
    const aula = aulas.find(a => a.id === id);
    document.getElementById('detalhe-titulo').innerText = aula.titulo;
    document.getElementById('detalhe-horario').innerText = `${aula.inicio} às ${aula.fim}`;
    fecharModais();
    document.getElementById('modal-detalhes').style.display = 'flex';
}

function prepararNovoEvento() {
    fecharModais();
    document.getElementById('input-data').value = dataClicada;
    document.getElementById('modal-cadastro').style.display = 'flex';
}

function salvarNovaAula(e) {
    e.preventDefault();
    aulas.push({
        id: Date.now(),
        data: document.getElementById('input-data').value,
        titulo: document.getElementById('input-titulo').value,
        inicio: document.getElementById('input-inicio').value,
        fim: document.getElementById('input-fim').value,
        cor: '#1aa3ff'
    });
    fecharModais();
    montarCalendario();
}

function excluirAula() {
    aulas = aulas.filter(a => a.id !== idSelecionado);
    fecharModais();
    montarCalendario();
}

function fecharModais() { document.querySelectorAll('.fundo-modal').forEach(m => m.style.display = 'none'); }

window.onclick = (e) => { if(e.target.classList.contains('fundo-modal')) fecharModais(); }