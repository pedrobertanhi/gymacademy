document.addEventListener("DOMContentLoaded", () => {
    const adminLogado = PowerGym.admin();
    if (adminLogado && adminLogado.nome) {
        const h1BoasVindas = document.getElementById("boas-vindas");
        if (h1BoasVindas) h1BoasVindas.innerText = `Histórico — ${adminLogado.nome}`;
    }

    const corpoTabela = document.getElementById("corpo-tabela-historico");
    const inputBusca = document.getElementById("busca-aluno");
    const selectModalidade = document.getElementById("filtro-modalidade");

    // Variáveis temporárias para guardar os dados do item clicado
    let aulaIdAlvo = null;
    let alunoIdAlvo = null;

    function renderizarTabela() {
        if (!corpoTabela) return;
        corpoTabela.innerHTML = "";

        const aulas = PowerGym.aulas();
        const termoBusca = inputBusca ? inputBusca.value.toLowerCase() : "";
        const modalidadeSelecionada = selectModalidade ? selectModalidade.value : "todos";

        let totalRegistros = 0;

        aulas.forEach(aula => {
            if (modalidadeSelecionada !== "todos" && aula.nome !== modalidadeSelecionada) {
                return;
            }

            aula.agendados.forEach((aluno, index) => {
                let nomeAluno = typeof aluno === 'object' ? aluno.nome : `Aluno Demonstrativo #${index + 1}`;
                let contatoAluno = typeof aluno === 'object' ? aluno.contato : "(11) 99999-9999";
                let emailAluno = typeof aluno === 'object' ? aluno.email : "demonstrativo@powergym.com";

                let identificadorAluno = typeof aluno === 'object' ? (aluno.id || aluno.nome) : aluno;

                if (termoBusca && !nomeAluno.toLowerCase().includes(termoBusca)) {
                    return;
                }

                totalRegistros++;

                const tr = document.createElement("tr");
                tr.innerHTML = `
                    <td><strong>${nomeAluno}</strong></td>
                    <td>${contatoAluno}</td>
                    <td>${emailAluno}</td>
                    <td><span class="badge-tabela-modalidade">${aula.nome}</span></td>
                    <td><span class="horario-tabela-destaque">${aula.horario}</span> (${aula.dia})</td>
                    <td>
                        <button class="btn-remover-reserva"
                                data-aula-id="${aula.id}"
                                data-aluno-id="${identificadorAluno}">
                            <i class="fa-solid fa-trash-can"></i> Desmarcar
                        </button>
                    </td>
                `;
                corpoTabela.appendChild(tr);
            });
        });

        if (totalRegistros === 0) {
            corpoTabela.innerHTML = `
                <tr>
                    <td colspan="6" style="text-align: center; color: var(--texto-suave); padding: 35px; font-size: 13px;">
                        Nenhum agendamento encontrado para os filtros aplicados.
                    </td>
                </tr>
            `;
        }

        configurarBotoesExclusao();
    }

    function configurarBotoesExclusao() {
        const botoes = document.querySelectorAll(".btn-remover-reserva");

        botoes.forEach(botao => {
            const novoBotao = botao.cloneNode(true);
            botao.parentNode.replaceChild(novoBotao, botao);

            novoBotao.addEventListener("click", () => {
                // Guarda os IDs do agendamento clicado nas variáveis de controle
                aulaIdAlvo = novoBotao.getAttribute("data-aula-id");
                alunoIdAlvo = novoBotao.getAttribute("data-aluno-id");

                // Abre o modal de confirmação estilizado na tela
                abrirModalConfirmar();
            });
        });
    }

    // --- FUNÇÕES DE GERENCIAMENTO DO MODAL CUSTOMIZADO ---
    function abrirModalConfirmar() {
        const modal = document.getElementById("modal-confirmar-desmarcar");
        if (modal) modal.classList.add("aberto");
    }

    window.fecharModalConfirmar = function() {
        const modal = document.getElementById("modal-confirmar-desmarcar");
        if (modal) modal.classList.remove("aberto");
        aulaIdAlvo = null;
        alunoIdAlvo = null;
    };

    // Escuta o clique do botão "Sim, Desmarcar" de dentro da caixa de diálogo
    const btnModalSim = document.getElementById("btn-modal-sim");
    if (btnModalSim) {
        btnModalSim.addEventListener("click", () => {
            if (aulaIdAlvo && alunoIdAlvo) {
                let bancoAulas = PowerGym.aulas();
                const aulaAlvo = bancoAulas.find(a => a.id === aulaIdAlvo);

                if (aulaAlvo) {
                    const indexReal = aulaAlvo.agendados.findIndex(aluno => {
                        if (typeof aluno === 'object') {
                            return (aluno.id === alunoIdAlvo || aluno.nome === alunoIdAlvo);
                        }
                        return aluno === alunoIdAlvo;
                    });

                    if (indexReal !== -1) {
                        // Remove o registro do LocalStorage
                        aulaAlvo.agendados.splice(indexReal, 1);

                        if (aulaAlvo.agendados.length < aulaAlvo.capacidade && aulaAlvo.status === 'cheia') {
                            aulaAlvo.status = 'aberta';
                        }

                        PowerGym.setAulas(bancoAulas);
                        fecharModalConfirmar();

                        // Exibe feedback de sucesso usando o padrão do seu shared.js
                        if (typeof mostrarPopupSucesso === "function") {
                            mostrarPopupSucesso({
                                mensagem: "Agendamento Cancelado!",
                                duracao: 1200,
                                depois: renderizarTabela
                            });
                        } else {
                            renderizarTabela();
                        }
                    }
                }
            }
        });
    }

    if (inputBusca) inputBusca.addEventListener("input", renderizarTabela);
    if (selectModalidade) selectModalidade.addEventListener("change", renderizarTabela);

    renderizarTabela();
});