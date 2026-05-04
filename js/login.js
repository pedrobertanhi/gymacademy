function alternarVisibilidade() {
    // Busca o input pelo novo ID 'senha'
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