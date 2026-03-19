/**
 * AUTH — Login e Cadastro
 */

// Se já está logado, redireciona
if (Storage.logado()) window.location.href = 'pages/dashboard.html';

// ── Carregar estatísticas públicas na landing ──
(async () => {
  try {
    const res = await Api.get('/dashboard');
    if (res?.ok) {
      const d = res.dados;
      document.getElementById('stat-alunos')?.textContent  !== null &&
        (document.getElementById('stat-alunos').textContent  = d.totalAlunos);
      document.getElementById('stat-acessos')?.textContent !== null &&
        (document.getElementById('stat-acessos').textContent = d.acessosHoje);
    }
  } catch (_) { /* sem backend, ignora */ }
})();

// ── Alternar painéis ──
const cardLogin    = document.getElementById('card-login');
const cardCadastro = document.getElementById('card-cadastro');

document.getElementById('ir-cadastro')?.addEventListener('click', e => {
  e.preventDefault();
  cardLogin.classList.add('hidden');
  cardCadastro.classList.remove('hidden');
});
document.getElementById('ir-login')?.addEventListener('click', e => {
  e.preventDefault();
  cardCadastro.classList.add('hidden');
  cardLogin.classList.remove('hidden');
});

// ── Toggle senha ──
document.querySelectorAll('.toggle-pwd').forEach(btn => {
  btn.addEventListener('click', () => {
    const input = btn.previousElementSibling;
    input.type = input.type === 'password' ? 'text' : 'password';
    btn.textContent = input.type === 'password' ? '👁' : '🙈';
  });
});

// ── LOGIN ──
document.getElementById('form-login')?.addEventListener('submit', async e => {
  e.preventDefault();
  const btn = document.getElementById('btn-login');
  setLoading(btn, true);

  const res = await Api.post('/auth/login', {
    email: document.getElementById('login-email').value.trim(),
    senha: document.getElementById('login-senha').value,
  }).catch(() => null);

  setLoading(btn, false);

  if (!res || !res.ok) {
    mostrarMsg('msg-login', res?.mensagem || 'Servidor indisponível.', 'error');
    return;
  }

  Storage.salvar(res.dados.token, res.dados.aluno);

  // Redireciona conforme o role
  const role = res.dados.aluno.role;
  if (role === 'ADMIN' || role === 'RECEPCIONISTA') {
    window.location.href = 'pages/dashboard.html';
  } else {
    window.location.href = 'pages/perfil.html';
  }
});

// ── CADASTRO ──
document.getElementById('form-cadastro')?.addEventListener('submit', async e => {
  e.preventDefault();
  const btn = document.getElementById('btn-cadastro');

  const planoSel = document.querySelector('input[name="plano"]:checked');
  if (!planoSel) {
    mostrarMsg('msg-cadastro', 'Selecione um plano.', 'error');
    return;
  }

  setLoading(btn, true);

  const res = await Api.post('/auth/cadastro', {
    nome:       document.getElementById('cad-nome').value.trim(),
    email:      document.getElementById('cad-email').value.trim(),
    senha:      document.getElementById('cad-senha').value,
    telefone:   document.getElementById('cad-telefone').value.trim() || null,
    tipoPlano:  planoSel.value,
  }).catch(() => null);

  setLoading(btn, false);

  if (!res || !res.ok) {
    mostrarMsg('msg-cadastro', res?.mensagem || 'Servidor indisponível.', 'error');
    return;
  }

  mostrarMsg('msg-cadastro', '✅ Conta criada! Faça login.', 'success');
  document.getElementById('form-cadastro').reset();
  setTimeout(() => {
    cardCadastro.classList.add('hidden');
    cardLogin.classList.remove('hidden');
    document.getElementById('login-email').value = document.getElementById('cad-email').value;
  }, 1800);
});

// ── Highlight plano selecionado ──
document.querySelectorAll('.plano-card').forEach(card => {
  card.addEventListener('click', () => {
    document.querySelectorAll('.plano-card').forEach(c => c.classList.remove('selected'));
    card.classList.add('selected');
  });
});
