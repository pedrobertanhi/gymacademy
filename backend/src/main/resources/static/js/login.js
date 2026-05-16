function alternarVisibilidade(campoId, icone) {
    const campo = document.getElementById(campoId);
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

document.getElementById('form-login').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value.trim().toLowerCase();
    const senha = document.getElementById('senha').value;
    const erro = document.getElementById('erro-login');
    const admin = PowerGym.admin();

    if (!admin) {
        erro.textContent = 'Nenhum admin cadastrado. Faça o cadastro primeiro.';
        erro.hidden = false;
        return;
    }
    if (email === admin.email.toLowerCase() && senha === admin.senha) {
        erro.hidden = true;
        window.location.href = 'home.html';
    } else {
        erro.textContent = 'E-mail ou senha incorretos.';
        erro.hidden = false;
    }
});
