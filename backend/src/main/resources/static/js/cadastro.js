function alternarVisibilidadeSenha(icone) {
    const campo = document.getElementById('senha');
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

function mascararContato(valor) {
    let v = valor.replace(/\D/g, '').slice(0, 11);
    if (v.length === 0) return '';
    if (v.length <= 2) return `(${v}`;
    if (v.length <= 6) return `(${v.slice(0, 2)}) ${v.slice(2)}`;
    if (v.length <= 10) return `(${v.slice(0, 2)}) ${v.slice(2, 6)}-${v.slice(6)}`;
    return `(${v.slice(0, 2)}) ${v.slice(2, 7)}-${v.slice(7)}`;
}

const campoContato = document.getElementById('contato');
campoContato.addEventListener('input', (e) => {
    e.target.value = mascararContato(e.target.value);
});

document.getElementById('form-cadastro').addEventListener('submit', (e) => {
    e.preventDefault();
    const erro = document.getElementById('erro-cadastro');
    const nome = document.getElementById('nome').value.trim();
    const email = document.getElementById('email').value.trim();
    const senha = document.getElementById('senha').value;
    const contato = document.getElementById('contato').value.trim();
    const generoEl = document.querySelector('input[name="genero"]:checked');
    const genero = generoEl ? generoEl.value : 'nenhum';

    if (!nome || !email || !senha || !contato) {
        erro.textContent = 'Preencha todos os campos.';
        erro.hidden = false;
        return;
    }
    if (senha.length < 6) {
        erro.textContent = 'A senha deve ter pelo menos 6 caracteres.';
        erro.hidden = false;
        return;
    }

    PowerGym.setAdmin({ nome, email, senha, contato, genero });
    erro.hidden = true;
    mostrarPopupSucesso({
        titulo: 'Cadastro Realizado!',
        mensagem: 'Faça Seu Login Para Continuar',
        icone: 'fa-circle-check',
        depois: () => { window.location.href = 'login.html'; }
    });
});
