function alternarVisibilidade() {
    var campoSenha = document.getElementById("senha");
    var icone = document.querySelector(".icone-alternar-senha");
    
    if (campoSenha.type === "password") {
        campoSenha.type = "text";
        icone.classList.remove("fa-eye");
        icone.classList.add("fa-eye-slash");
    } else {
        campoSenha.type = "password";
        icone.classList.remove("fa-eye-slash");
        icone.classList.add("fa-eye");
    }
}

// Opcional: Pequena máscara para o campo de contato
const campoContato = document.getElementById('contato');
campoContato.addEventListener('input', (e) => {
    let valor = e.target.value.replace(/\D/g, ''); // Remove tudo que não é número
    if (valor.length > 11) valor = valor.slice(0, 11);
    
    // Aplica a máscara (XX) XXXXX-XXXX
    if (valor.length > 2) {
        valor = `(${valor.slice(0, 2)}) ${valor.slice(2)}`;
    }
    if (valor.length > 9) {
        valor = `${valor.slice(0, 9)}-${valor.slice(9)}`;
    }
    e.target.value = valor;
});