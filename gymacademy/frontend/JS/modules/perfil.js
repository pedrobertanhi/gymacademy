/**
 * PERFIL — Área do Aluno
 */

if (!Storage.logado()) window.location.href = '../index.html';

const usuario = Storage.getUsuario();

// Logout
document.getElementById('btn-logout')?.addEventListener('click', () => {
  Storage.limpar();
  window.location.href = '../index.html';
});

// Link catraca
document.getElementById('link-catraca')?.setAttribute(
  'href', `catraca.html?email=${encodeURIComponent(usuario?.email || '')}`
);

// ── Carregar dados ────────────────────────────────────────
async function carregarPerfil() {
  const res = await Api.get('/alunos/me').catch(() => null);
  if (!res?.ok) return;
  const a = res.dados;

  document.getElementById('perfil-avatar').textContent = iniciais(a.nome);
  document.getElementById('perfil-nome').textContent   = a.nome;
  document.getElementById('perfil-email').textContent  = a.email;
  document.getElementById('perf-nome').value     = a.nome;
  document.getElementById('perf-telefone').value = a.telefone || '';

  // Status do plano
  const icon = !a.planoAtivo ? '❌' : a.diasRestantes <= 7 ? '⚠️' : '✅';
  document.getElementById('plano-icon').textContent  = icon;
  document.getElementById('plano-nome').textContent  = `Plano ${a.tipoPlano}`;
  document.getElementById('plano-venc').textContent  = `Válido até ${fmtData(a.dataFimPlano)}`;
  document.getElementById('plano-badge').innerHTML   = badgePlano(a.diasRestantes, a.planoAtivo);

  // Alertas
  if (!a.planoAtivo) {
    document.getElementById('alerta-vencido').classList.remove('hidden');
  } else if (a.diasRestantes <= 7) {
    document.getElementById('alerta-vencendo').classList.remove('hidden');
  }

  carregarHistorico(a.id);
}

async function carregarHistorico(alunoId) {
  const tbody = document.getElementById('tbody-historico');
  const res = await Api.get(`/acessos/historico/${alunoId}?page=0&size=15`).catch(() => null);

  if (!res?.ok) {
    tbody.innerHTML = `<tr><td colspan="3" style="text-align:center;color:var(--red);padding:24px">Erro ao carregar histórico.</td></tr>`;
    return;
  }

  const acessos = res.dados.content;
  if (!acessos.length) {
    tbody.innerHTML = `<tr><td colspan="3" style="text-align:center;color:var(--text-muted);padding:24px">Nenhum acesso registrado ainda.</td></tr>`;
    return;
  }

  tbody.innerHTML = acessos.map(a => `
    <tr>
      <td>${fmtDataHora(a.dataHoraAcesso)}</td>
      <td>${badgeStatus(a.status)}</td>
      <td style="color:var(--text-muted);font-size:12px">${a.observacao || '—'}</td>
    </tr>`).join('');
}

// ── Salvar dados ──────────────────────────────────────────
document.getElementById('form-perfil')?.addEventListener('submit', async e => {
  e.preventDefault();
  const btn = e.target.querySelector('button[type="submit"]');
  setLoading(btn, true);

  const res = await Api.put(`/alunos/${usuario.id}`, {
    nome:     document.getElementById('perf-nome').value.trim(),
    telefone: document.getElementById('perf-telefone').value.trim() || null,
  }).catch(() => null);

  setLoading(btn, false);
  if (!res?.ok) { mostrarMsg('msg-perfil', res?.mensagem || 'Erro.', 'error'); return; }

  mostrarMsg('msg-perfil', '✅ Dados atualizados com sucesso!', 'success');
  Storage.salvar(Storage.getToken(), { ...usuario, nome: res.dados.nome });
  document.getElementById('perfil-nome').textContent = res.dados.nome;
  document.getElementById('perfil-avatar').textContent = iniciais(res.dados.nome);
});

// ── Alterar senha ─────────────────────────────────────────
document.getElementById('form-senha')?.addEventListener('submit', async e => {
  e.preventDefault();
  const btn = e.target.querySelector('button[type="submit"]');
  setLoading(btn, true);

  const res = await Api.patch(`/alunos/${usuario.id}/senha`, {
    senhaAtual: document.getElementById('senha-atual').value,
    novaSenha:  document.getElementById('senha-nova').value,
  }).catch(() => null);

  setLoading(btn, false);
  if (!res?.ok) { mostrarMsg('msg-senha', res?.mensagem || 'Erro.', 'error'); return; }

  mostrarMsg('msg-senha', '✅ Senha alterada com sucesso!', 'success');
  document.getElementById('form-senha').reset();
});

// ── Init ──────────────────────────────────────────────────
carregarPerfil();
