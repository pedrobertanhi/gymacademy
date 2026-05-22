document.addEventListener("DOMContentLoaded", () => {
    // Exibir nome do Admin Logado
    const adminLogado = PowerGym.admin();
    if (adminLogado && adminLogado.nome) {
        const h1BoasVindas = document.getElementById("boas-vindas");
        if (h1BoasVindas) h1BoasVindas.innerText = `Bem-Vindo, ${adminLogado.nome}!`;
    }

    const containerLista = document.getElementById("lista-alunos");
    const inputBusca = document.getElementById("busca-aluno");
    const elLotacao = document.getElementById("lotacao-atual");

    let alunoSelecionadoId = null;
    let botaoSelecionadoRef = null;
    let lotacaoContador = 0;

    // 1. Renderizar a Lista de Alunos na Home
    function renderizarAlunosHome() {
        if (!containerLista) return;

        containerLista.innerHTML = "";
        const alunos = PowerGym.alunos();
        const aulas = PowerGym.aulas();
        const termoBusca = inputBusca ? inputBusca.value.toLowerCase() : "";

        let alunosFiltrados = alunos.filter(aluno => {
            const matchNome = aluno.nome.toLowerCase().includes(termoBusca);
            const matchContato = aluno.contato && aluno.contato.includes(termoBusca);
            return matchNome || matchContato;
        });

        if (alunosFiltrados.length === 0) {
            containerLista.innerHTML = `<div class="lista-vazia">Nenhum aluno encontrado.</div>`;
            return;
        }

        alunosFiltrados.forEach((aluno, index) => {
            // Busca se o aluno está cadastrado em alguma aula (Objetos ou placeholders de String)
            const aulaDoAluno = aulas.find(aula =>
                aula.agendados.some((ag, idx) => {
                    if (typeof ag === 'object') {
                        return ag.id === aluno.id || ag.nome === aluno.nome;
                    }
                    return index === idx && aula.nome === "AULA DE BOXE";
                })
            );

            const nomeAula = aulaDoAluno ? aulaDoAluno.nome : "Sem Agendamento";

            const div = document.createElement("div");
            div.className = "linha-aluno";
            div.innerHTML = `
                <div class="info-aluno">
                    <i class="fa-solid fa-user icone-aluno"></i>
                    <div class="textos-aluno">
                        <h4>${aluno.nome}</h4>
                        <p>${aluno.contato || '(11) 99999-9999'} | <strong>${nomeAula}</strong></p>
                    </div>
                </div>
                <div class="status-aluno ${aluno.ativo ? 'status-ativo' : 'status-inativo'}">
                    ${aluno.ativo ? 'Ativo' : 'Inativo'}
                </div>
                <button type="button"
                        class="btn-catraca ativo"
                        data-id="${aluno.id || index}"
                        data-ativo="${aluno.ativo}"
                        data-agendado="${aulaDoAluno ? 'sim' : 'nao'}">
                    <i class="fa-solid fa-hardware-is-hardware"></i> Liberar Acesso
                </button>
            `;
            containerLista.appendChild(div);
        });

        configurarBotoesCatraca();
    }

    // 2. Configura o clique dos botões de liberação de forma segura
    function configurarBotoesCatraca() {
        const botoes = document.querySelectorAll(".btn-catraca");
        botoes.forEach(botao => {
            // Remove ouvintes antigos para não duplicar cliques na memória
            const novoBotao = botao.cloneNode(true);
            botao.parentNode.replaceChild(novoBotao, botao);

            novoBotao.addEventListener("click", () => {
                alunoSelecionadoId = novoBotao.getAttribute("data-id");
                const isAtivo = novoBotao.getAttribute("data-ativo") === "true";
                const isAgendado = novoBotao.getAttribute("data-agendado") === "sim";
                botaoSelecionadoRef = novoBotao;

                // Bloqueio de cadastro Inativo
                if (!isAtivo) {
                    atualizarBotaoStatus(novoBotao, 'negado');
                    abrirModalAcessoPersonalizado("modal-acesso-negado", "Acesso Recusado: Este aluno está com o cadastro INATIVO no sistema.");
                    return;
                }

                // Bloqueio de falta de Agendamento
                if (!isAgendado) {
                    atualizarBotaoStatus(novoBotao, 'negado');
                    abrirModalAcessoPersonalizado("modal-acesso-negado", "Acesso Recusado: Aluno ativo, mas sem AGENDAMENTO para nenhuma aula.");
                    return;
                }

                // Tudo OK, abre o modal de confirmação
                abrirModalCatraca();
            });
        });
    }

    // Mudança visual dos estados dos botões
    function atualizarBotaoStatus(botao, estado) {
        if (!botao) return;

        if (estado === 'liberado') {
            botao.innerHTML = `<i class="fa-solid fa-circle-check"></i> Liberado`;
            botao.style.backgroundColor = "#10b981"; // Verde
            botao.style.color = "#ffffff";
        } else if (estado === 'travado') {
            botao.innerHTML = `<i class="fa-solid fa-lock"></i> Travado`;
            botao.style.backgroundColor = "#ef4444"; // Vermelho
            botao.style.color = "#ffffff";
        } else if (estado === 'negado') {
            botao.innerHTML = `<i class="fa-solid fa-circle-xmark"></i> Não Liberado`;
            botao.style.backgroundColor = "#ef4444"; // Vermelho
            botao.style.color = "#ffffff";
        }
    }

    // 3. Controle das Janelas Modais (Escopo Global / Windows)
    function abrirModalAcessoPersonalizado(idModal, textoMensagem) {
        const campoTextoNegado = document.getElementById("msg-negado-texto");
        const campoTextoPermitido = document.getElementById("msg-permitido-texto");

        if(idModal === "modal-acesso-negado" && campoTextoNegado) {
            campoTextoNegado.innerText = textoMensagem;
        } else if(idModal === "modal-acesso-permitido" && campoTextoPermitido) {
            campoTextoPermitido.innerText = textoMensagem;
        }

        const modal = document.getElementById(idModal);
        if (modal) modal.classList.add("aberto");
    }

    window.fecharModalAcesso = function(idModal) {
        const modal = document.getElementById(idModal);
        if (modal) modal.classList.remove("aberto");
    };

    window.abrirModalCatraca = function() {
        const modal = document.getElementById("modal-catraca");
        if (modal) modal.classList.add("aberto");
    };

    // Resposta ao clicar em "Não" no Modal de liberação
    window.fecharModalCatraca = function() {
        const modal = document.getElementById("modal-catraca");
        if (modal) modal.classList.remove("aberto");

        // Se o ADM rejeitou pelo modal, deixa vermelho escrito "Travado"
        if (botaoSelecionadoRef) {
            atualizarBotaoStatus(botaoSelecionadoRef, 'travado');
        }
    };

    // Resposta ao clicar em "Sim" no Modal de liberação
    window.confirmarLiberacao = function() {
        if (botaoSelecionadoRef) {
            atualizarBotaoStatus(botaoSelecionadoRef, 'liberado');

            lotacaoContador++;
            if (elLotacao) elLotacao.innerText = lotacaoContador;

            const modal = document.getElementById("modal-catraca");
            if (modal) modal.classList.remove("aberto");

            abrirModalAcessoPersonalizado("modal-acesso-permitido", "Acesso autorizado! A catraca física foi destravada.");
        }
    };

    // Evento do input de busca
    if (inputBusca) {
        inputBusca.addEventListener("input", renderizarAlunosHome);
    }

    // Executa a primeira renderização
    renderizarAlunosHome();
});