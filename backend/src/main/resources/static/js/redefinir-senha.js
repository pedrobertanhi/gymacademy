function alternarVisibilidadeCampo(campoId, icone) {
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

document.getElementById('form-redefinir').addEventListener('submit', (e) => {
    e.preventDefault();
    const nova = document.getElementById('nova-senha').value;
    const conf = document.getElementById('confirmar-senha').value;
    const erro = document.getElementById('erro-redefinir');

    if (nova.length < 6) {
        erro.textContent = 'A senha deve ter pelo menos 6 caracteres.';
        erro.hidden = false;
        return;
    }
    if (nova !== conf) {
        erro.textContent = 'As senhas não coincidem.';
        erro.hidden = false;
        return;
    }

    const admin = PowerGym.admin();
    if (!admin) {
        erro.textContent = 'Nenhum admin cadastrado.';
        erro.hidden = false;
        return;
    }
    admin.senha = nova;
    PowerGym.setAdmin(admin);

    mostrarPopupSucesso({
        titulo: 'Senha Redefinida!',
        mensagem: 'Faça Login Com A Nova Senha',
        icone: 'fa-key',
        depois: () => { window.location.href = 'login.html'; }
    });
});
