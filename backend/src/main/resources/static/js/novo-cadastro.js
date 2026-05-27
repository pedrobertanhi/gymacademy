/* ============================================
   NOVO CADASTRO DE ALUNO (ADMIN) - VISUAL LOGIN
   ============================================ */

// 1. Função para o Olho da Senha (Adaptado para o seu HTML)
function alternarVisibilidadeSenha(icone) {
    const campo = document.getElementById('senha');
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

// 2. Máscara de Contato
function mascararContato(v) {
    v = v.replace(/\D/g, "");
    if (v.length <= 2) return `(${v}`;
    if (v.length <= 6) return `(${v.slice(0,2)}) ${v.slice(2)}`;
    if (v.length <= 10) return `(${v.slice(0,2)}) ${v.slice(2,6)}-${v.slice(6)}`;
    return `(${v.slice(0,2)}) ${v.slice(2,7)}-${v.slice(7)}`;
}

const inputContato = document.getElementById('contato');
if(inputContato) inputContato.addEventListener('input', e => e.target.value = mascararContato(e.target.value));

// 3. Submissão do Formulário para a API (H2)
const formNovoAluno = document.getElementById('form-novo-aluno');
if(formNovoAluno) {
    formNovoAluno.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Puxando os IDs exatos do seu HTML
        const nome = document.getElementById('nome').value.trim();
        const email = document.getElementById('email').value.trim();
        const senha = document.getElementById('senha').value;
        const contato = document.getElementById('contato').value.trim();

        const generoEl = document.querySelector('input[name="genero"]:checked');
        const genero = generoEl ? generoEl.value : 'Nao Informado';

        // Como o seu design não tem CPF, vamos gerar um fictício só para a API aceitar
        const cpfFicticio = Math.floor(10000000000 + Math.random() * 90000000000).toString().replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");

        const erro = document.getElementById('erro-novo'); // ID do seu HTML
        if (erro) erro.hidden = true;

        if (!nome || !email || !senha || !contato) {
            if(erro) {
                erro.textContent = 'Preencha todos os campos obrigatórios.';
                erro.hidden = false;
            }
            return;
        }

        try {
            // Envia para o Spring Boot!
            const response = await fetch("http://localhost:8081/api/alunos", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    nome: nome,
                    email: email,
                    senha: senha,
                    contato: contato,
                    genero: genero,
                    cpf: cpfFicticio, // CPF gerado para não quebrar a restrição do banco
                    planoFim: null, // O Java coloca +1 mês automático
                    ativo: true
                })
            });

            if (response.ok) {
                if(typeof mostrarPopupSucesso === 'function') {
                    mostrarPopupSucesso({
                        titulo: 'Cadastro Concluído!',
                        mensagem: 'Aluno Registado com Sucesso',
                        icone: 'fa-user-check',
                        depois: () => { window.location.href = 'home.html'; }
                    });
                } else {
                    alert("Aluno Registado com Sucesso!");
                    window.location.href = 'home.html';
                }
            } else {
                const errorData = await response.json().catch(() => null);
                if(erro) {
                    erro.textContent = "Erro: " + (errorData?.message || "O e-mail já está cadastrado.");
                    erro.hidden = false;
                }
            }
        } catch (error) {
            console.error("Erro na API:", error);
            if(erro) {
                erro.textContent = "Falha ao conectar com o servidor.";
                erro.hidden = false;
            }
        }
    });
}