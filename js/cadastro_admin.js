// --- CONFIGURAÇÃO INICIAL E USUÁRIO DE TESTE ---
const inicializarSistema = () => {
    let lista = JSON.parse(localStorage.getItem('admins_powergym')) || [];
    
    // Se não houver ninguém, cria o usuário para você testar
    if (lista.length === 0) {
        lista.push({
            id: "1001",
            nome: "Usuario de Teste",
            email: "teste@ads.com",
            contato: "11 98888-0000",
            genero: "masculino"
        });
        localStorage.setItem('admins_powergym', JSON.stringify(lista));
    }
    renderizarLista();
};

// --- CONTROLE DE ABAS ---
function alternarAba(modo) {
    const btnCadastro = document.getElementById('btn-aba-cadastro');
    const btnAtualizar = document.getElementById('btn-aba-atualizar');
    const secaoForm = document.getElementById('secao-formulario');
    const secaoLista = document.getElementById('secao-lista');

    if (modo === 'cadastro') {
        btnCadastro.classList.add('aba-ativa');
        btnAtualizar.classList.remove('aba-ativa');
        secaoForm.classList.remove('escondido');
        secaoLista.classList.add('escondido');
        resetarModo(); // Garante que o form esteja limpo para novo cadastro
    } else {
        btnCadastro.classList.remove('aba-ativa');
        btnAtualizar.classList.add('aba-ativa');
        secaoForm.classList.add('escondido');
        secaoLista.classList.remove('escondido');
        renderizarLista(); // Atualiza a tabela antes de mostrar
    }
}

// --- LÓGICA DE CRUD ---
const renderizarLista = () => {
    const lista = JSON.parse(localStorage.getItem('admins_powergym')) || [];
    const corpo = document.getElementById('tabela-corpo');
    corpo.innerHTML = "";

    lista.forEach(admin => {
        corpo.innerHTML += `
            <tr>
                <td>${admin.nome}</td>
                <td>${admin.email}</td>
                <td><button class="btn-editar" onclick='iniciarEdicao(${JSON.stringify(admin)})'>Editar</button></td>
            </tr>
        `;
    });
};

const iniciarEdicao = (admin) => {
    // Muda para a aba de formulário mas em modo "Edição"
    alternarAba('cadastro');
    document.getElementById('titulo-pagina').textContent = "Atualizar Cadastro";
    document.getElementById('botao-acao').textContent = "Salvar Alteracoes";
    document.getElementById('botao-cancelar').classList.remove('escondido');
    document.getElementById('aviso-senha').classList.remove('escondido');

    // Preenche dados
    document.getElementById('admin-id').value = admin.id;
    document.getElementById('nome').value = admin.nome;
    document.getElementById('email').value = admin.email;
    document.getElementById('contato').value = admin.contato;
    document.getElementsByName('genero').forEach(r => {
        if (r.value === admin.genero) r.checked = true;
    });
    document.getElementById('senha').required = false;
};

const resetarModo = () => {
    document.getElementById('titulo-pagina').textContent = "Cadastro de Novo Admin";
    document.getElementById('botao-acao').textContent = "Cadastrar Admin";
    document.getElementById('botao-cancelar').classList.add('escondido');
    document.getElementById('aviso-senha').classList.add('escondido');
    document.getElementById('formulario-admin').reset();
    document.getElementById('admin-id').value = "";
    document.getElementById('senha').required = true;
};

document.getElementById('formulario-admin').onsubmit = (e) => {
    e.preventDefault();
    const id = document.getElementById('admin-id').value;
    let lista = JSON.parse(localStorage.getItem('admins_powergym'));

    const admin = {
        id: id || Date.now().toString(),
        nome: document.getElementById('nome').value,
        email: document.getElementById('email').value,
        contato: document.getElementById('contato').value,
        genero: document.querySelector('input[name="genero"]:checked').value
    };

    if (id) {
        const index = lista.findIndex(a => a.id === id);
        lista[index] = admin;
        alert("Dados atualizados!");
    } else {
        lista.push(admin);
        alert("Cadastrado com sucesso!");
    }

    localStorage.setItem('admins_powergym', JSON.stringify(lista));
    alternarAba('lista'); // Volta para a lista para ver o resultado
};

function alternarVisibilidade() {
    const s = document.getElementById('senha');
    s.type = s.type === 'password' ? 'text' : 'password';
}

inicializarSistema();