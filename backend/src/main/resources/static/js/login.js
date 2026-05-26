// Mantém a sua função visual original do olhinho da senha
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

document.addEventListener("DOMContentLoaded", () => {
    // Pegando exatamente o ID que você tem no seu HTML (form-login)
    const loginForm = document.getElementById("form-login");

    if (loginForm) {
        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            // Pegando os IDs que você já usa no seu HTML
            const email = document.getElementById("email").value.trim();
            const senha = document.getElementById("senha").value;
            const erro = document.getElementById('erro-login');

            // Limpa mensagens de erro antigas
            if (erro) erro.hidden = true;

            try {
                // Chama a nossa nova rota centralizada do Spring Boot
                const response = await fetch("http://localhost:8081/api/auth/login", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ email, senha })
                });

                if (response.ok) {
                    const data = await response.json();

                    // Salva a ROLE para podermos esconder menus depois
                    sessionStorage.setItem("userId", data.id);
                    sessionStorage.setItem("userName", data.nome);
                    sessionStorage.setItem("userRole", data.role);
                    if(data.token) sessionStorage.setItem("userToken", data.token);

                    // Redirecionamento Inteligente!
                    if (data.role === "ADMIN") {
                        window.location.href = "home.html";
                    } else if (data.role === "ALUNO") {
                        window.location.href = "agenda.html";
                    } else {
                        window.location.href = "index.html";
                    }
                } else {
                    // Erro 401 ou 403 do Backend (Senha errada ou usuário não existe)
                    if (erro) {
                        erro.textContent = 'E-mail ou senha incorretos.';
                        erro.hidden = false;
                    } else {
                        alert('E-mail ou senha incorretos.');
                    }
                }
            } catch (error) {
                console.error("Erro no fetch:", error);
                if (erro) {
                    erro.textContent = 'Erro ao conectar ao servidor. Tente novamente.';
                    erro.hidden = false;
                }
            }
        });
    }
});