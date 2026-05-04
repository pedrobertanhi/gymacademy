// Função para mostrar/ocultar a senha de forma independente
function alternarVisibilidade(iconeClicado) {
    // Busca o campo de input que está imediatamente antes do ícone clicado
    var campoSenha = iconeClicado.previousElementSibling;
    
    if (campoSenha.type === "password") {
        campoSenha.type = "text";
        iconeClicado.classList.remove("fa-eye");
        iconeClicado.classList.add("fa-eye-slash");
    } else {
        campoSenha.type = "password";
        iconeClicado.classList.remove("fa-eye-slash");
        iconeClicado.classList.add("fa-eye");
    }
}

// Validação do formulário ao tentar redefinir a senha
document.querySelector('form').addEventListener('submit', function(event) {
    var novaSenha = document.getElementById('nova-senha').value;
    var confirmarSenha = document.getElementById('confirmar-senha').value;

    // Verifica se as senhas são iguais
    if (novaSenha !== confirmarSenha) {
        event.preventDefault(); // Impede o recarregamento/envio da página
        alert("As senhas não coincidem. Por favor, verifique e tente novamente.");
        return;
    }

    // Opcional: Verifica se a senha tem um tamanho mínimo de segurança
    if (novaSenha.length < 6) {
        event.preventDefault();
        alert("A nova senha deve ter pelo menos 6 caracteres.");
        return;
    }

    // Se passar por todas as validações, o formulário segue o fluxo normal.
});