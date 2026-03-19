/**
 * DASHBOARD — Painel Admin/Recepcionista
 */

// Guard: só acessa logado
if (!Storage.logado()) window.location.href = '../index.html';

const usuario = Storage.getUsuario();
let paginaAtualAlunos = 0;
let alunoEmEdicaoId   = null;
let alunoRenovarId    = null;

// ── Bootstrap ──────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  renderizarSidebar();
  navegarPara('home');

  // Hamburger mobile
  document.getElementById('hamburger').addEventListener('click', () => {
    document.getElementById('sidebar').classList.toggle('open');
  });

  // Navegação sidebar
  document.querySelectorAll('.nav-item[data-page]').forEach(btn => {
    btn.addEventListener('click', () => {
      const page = btn.dataset.page;
      if (page === 'catraca-link') {
        window.open(`catraca.html?email=${encodeURIComponent(usuario.email)}`, '_blank');
        return;
      }
      navegarPara(page);
      document.getElementById('sidebar').classList.remove('open');
    });
  });

  // Logout
  document.getElementById('btn-logout').addEventListener('click', () => {
    Storage.limpar();
    window.location.href = '../index.html';
  });

  // Busca alunos
  let debounce;
  document.getElementById('search-input')?.addEventListener('input', e => {
    clearTimeout(debounce);
    debounce = setTimeout(() => {
      paginaAtualAlunos = 0;
      carregarAlunos(e.target.value);
    }, 350);
  });

  // Botão novo aluno
  document.getElementById('btn-novo-aluno')?.addEventListener('click', () => abrirModalNovoAluno());

  // Salvar aluno (modal)
  document.getElementById('btn-salvar-aluno')?.addEventListener('click', salvarAluno);

  // Renovar plano
  document.getElementById('btn-confirmar-renovar')?.addEventListener('click', confirmarRenovacao);

  // Perfil
  document.getElementById('form-perfil')?.addEventListener('submit', salvarPerfil);
  document.getElementById('form-senha')?.addEventListener('submit', salvarSenha);

  // Fechar modais clicando fora
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', e => {
      if (e.target === overlay) overlay.classList.remove('open');
    });
  });
});

// ── Sidebar / usuário ──────────────────────────────────────
function renderizarSidebar() {
  document.getElementById('sidebar-avatar').textContent = iniciais(usuario?.nome || '?');
  document.getElementById('sidebar-nome').textContent   = usuario?.nome || '—';
  document.getElementById('sidebar-role').textContent   = roleLabel(usuario?.role);
}

function roleLabel(role) {
  return { ADMIN: '👑 Admin', RECEPCIONISTA: '🖥 Recepcionista', ALUNO: '🏋️ Aluno' }[role] || role;
}

// ── Navegação entre páginas ───────────────────────────────
function navegarPara(page) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  document.querySelector(`[data-page="${page}"]`)?.classList.add('active');

  const titulos = { home: 'Dashboard', alunos: 'Alunos', acessos: 'Acessos', perfil: 'Meu Perfil' };
  document.getElementById('topbar-title').textContent = titulos[page] || '';

  const searchBox   = document.getElementById('search-box');
  const btnNovoAluno = document.getElementById('btn-novo-aluno');
  searchBox?.style.setProperty('display', page === 'alunos' ? 'flex' : 'none');
  btnNovoAluno?.style.setProperty('display', page === 'alunos' ? 'inline-flex' : 'none');

  const el = document.getElementById(`page-${page}`);
  if (el) el.classList.add('active');

  // Carregamento por página
  if (page === 'home')    carregarHome();
  if (page === 'alunos')  carregarAlunos();
  if (page === 'acessos') carregarAcessos();
  if (page === 'perfil')  carregarPerfil();
}

// ── HOME / DASHBOARD ─────────────────────────────────────
async function carregarHome() {
  await Promise.all([carregarMetricas(), carregarFeed(), carregarVencendo()]);
}

async function carregarMetricas() {
  const res = await Api.get('/dashboard').catch(() => null);
  if (!res?.ok) return;
  const d = res.dados;

  document.getElementById('metrics-grid').innerHTML = `
    <div class="metric-card green">
      <div class="metric-icon">👥</div>
      <div class="metric-value">${d.totalAlunos}</div>
      <div class="metric-label">Total de Alunos</div>
    </div>
    <div class="metric-card green">
      <div class="metric-icon">✅</div>
      <div class="metric-value">${d.planosAtivos}</div>
      <div class="metric-label">Planos Ativos</div>
    </div>
    <div class="metric-card red">
      <div class="metric-icon">❌</div>
      <div class="metric-value">${d.planosVencidos}</div>
      <div class="metric-label">Planos Vencidos</div>
    </div>
    <div class="metric-card blue">
      <div class="metric-icon">🚪</div>
      <div class="metric-value">${d.acessosHoje}</div>
      <div class="metric-label">Acessos Hoje</div>
    </div>
    <div class="metric-card blue">
      <div class="metric-icon">📅</div>
      <div class="metric-value">${d.acessosSemana}</div>
      <div class="metric-label">Acessos (7 dias)</div>
    </div>
    <div class="metric-card red">
      <div class="metric-icon">🚫</div>
      <div class="metric-value">${d.bloqueiosHoje}</div>
      <div class="metric-label">Bloqueios Hoje</div>
    </div>
    <div class="metric-card yellow">
      <div class="metric-icon">⚠️</div>
      <div class="metric-value">${d.planosVencendo7Dias}</div>
      <div class="metric-label">Vencendo em 7 dias</div>
    </div>
    <div class="metric-card green">
      <div class="metric-icon">💰</div>
      <div class="metric-value" style="font-size:28px">${fmtMoeda(d.receitaMes)}</div>
      <div class="metric-label">Receita do Mês</div>
    </div>
  `;

  if (d.planosVencendo7Dias > 0) {
    document.getElementById('alert-vencendo').classList.remove('hidden');
    document.getElementById('alert-vencendo-num').textContent = d.planosVencendo7Dias;
  }
}

async function carregarFeed() {
  const res = await Api.get('/acessos/ultimos').catch(() => null);
  const feed = document.getElementById('feed-acessos');
  if (!res?.ok) { feed.innerHTML = '<p class="text-muted text-sm text-center">Não foi possível carregar.</p>'; return; }

  if (!res.dados.length) {
    feed.innerHTML = '<p class="text-muted text-sm text-center" style="padding:16px">Nenhum acesso registrado.</p>';
    return;
  }

  feed.innerHTML = res.dados.map(a => {
    const liberado = a.status === 'LIBERADO';
    return `
      <div class="feed-item">
        <div class="feed-dot ${liberado ? 'verde' : 'vermelho'}"></div>
        <div class="feed-nome">${a.alunoNome}</div>
        <div class="feed-hora">${fmtHora(a.dataHoraAcesso)}</div>
        ${liberado ? '<span class="badge badge-green">✅</span>' : '<span class="badge badge-red">❌</span>'}
      </div>`;
  }).join('');
}

async function carregarVencendo() {
  const res = await Api.get('/alunos?q=&page=0&size=50').catch(() => null);
  const el  = document.getElementById('lista-vencendo');
  if (!res?.ok) { el.innerHTML = '<p class="text-muted text-sm">—</p>'; return; }

  const vencendo = res.dados.content.filter(a => a.planoAtivo && a.diasRestantes <= 7 && a.diasRestantes > 0);
  if (!vencendo.length) {
    el.innerHTML = '<p class="text-muted text-sm text-center" style="padding:16px">✅ Nenhum plano vencendo em breve.</p>';
    return;
  }

  el.innerHTML = vencendo.map(a => `
    <div class="feed-item">
      <div class="feed-dot" style="background:var(--yellow)"></div>
      <div class="feed-nome">${a.nome}</div>
      <span class="badge badge-yellow">${a.diasRestantes}d</span>
      <button class="btn-icon" onclick="abrirModalRenovar(${a.id},'${a.nome}')">↻</button>
    </div>`).join('');
}

function mostrarVencendo() { navegarPara('alunos'); }

// ── ALUNOS ───────────────────────────────────────────────
async function carregarAlunos(q = '', page = paginaAtualAlunos) {
  const tbody = document.getElementById('tbody-alunos');
  tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;padding:32px"><div class="spinner" style="margin:0 auto"></div></td></tr>`;

  const res = await Api.get(`/alunos?q=${encodeURIComponent(q)}&page=${page}&size=10`).catch(() => null);
  if (!res?.ok) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;color:var(--red);padding:32px">Erro ao carregar.</td></tr>`;
    return;
  }

  const { content, totalElements, totalPages, number } = res.dados;
  document.getElementById('alunos-count').textContent = `${totalElements} aluno(s) encontrado(s)`;
  paginaAtualAlunos = number;

  if (!content.length) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;color:var(--text-muted);padding:32px">Nenhum aluno encontrado.</td></tr>`;
    renderizarPaginacao(totalPages, number, q);
    return;
  }

  tbody.innerHTML = content.map(a => {
    const perc = Math.min(100, Math.round((a.diasRestantes / 30) * 100));
    const barCor = !a.planoAtivo ? 'red' : a.diasRestantes <= 7 ? 'yellow' : '';
    return `
    <tr>
      <td>
        <div class="aluno-nome-cell">
          <div class="aluno-avatar-sm">${iniciais(a.nome)}</div>
          <div>
            <div style="font-weight:600">${a.nome}</div>
            <div style="font-size:12px;color:var(--text-muted)">${a.email}</div>
          </div>
        </div>
      </td>
      <td>${a.tipoPlano}</td>
      <td>
        <div>${fmtData(a.dataFimPlano)}</div>
        <div class="plano-bar">
          <div class="plano-bar-track">
            <div class="plano-bar-fill ${barCor}" style="width:${a.planoAtivo ? perc : 0}%"></div>
          </div>
          <span style="color:var(--text-muted);font-size:11px">${a.diasRestantes}d</span>
        </div>
      </td>
      <td>${badgePlano(a.diasRestantes, a.planoAtivo)} ${!a.ativo ? '<span class="badge badge-gray">Inativo</span>' : ''}</td>
      <td>
        <div style="display:flex;gap:6px;flex-wrap:wrap">
          <button class="btn-icon" title="Renovar Plano"   onclick="abrirModalRenovar(${a.id},'${a.nome}')">↻</button>
          <button class="btn-icon" title="${a.ativo ? 'Desativar' : 'Ativar'}" onclick="alterarStatus(${a.id},${!a.ativo},'${a.nome}')">
            ${a.ativo ? '🔴' : '🟢'}
          </button>
          <button class="btn-icon" title="Ver acessos" onclick="verAcessos(${a.id},'${a.nome}')">📋</button>
        </div>
      </td>
    </tr>`;
  }).join('');

  renderizarPaginacao(totalPages, number, q);
}

function renderizarPaginacao(total, atual, q) {
  const el = document.getElementById('paginacao-alunos');
  if (total <= 1) { el.innerHTML = ''; return; }

  let html = `<button class="page-btn" ${atual === 0 ? 'disabled' : ''} onclick="mudarPagina(${atual-1},'${q}')">‹</button>`;
  for (let i = 0; i < total; i++) {
    html += `<button class="page-btn ${i === atual ? 'active' : ''}" onclick="mudarPagina(${i},'${q}')">${i+1}</button>`;
  }
  html += `<button class="page-btn" ${atual === total-1 ? 'disabled' : ''} onclick="mudarPagina(${atual+1},'${q}')">›</button>`;
  el.innerHTML = html;
}

function mudarPagina(pg, q) {
  paginaAtualAlunos = pg;
  carregarAlunos(q, pg);
}

// ── ACESSOS ──────────────────────────────────────────────
async function carregarAcessos() {
  const tbody = document.getElementById('tbody-acessos');
  // Reutilizamos os últimos 10 do feed; numa versão completa, faríamos paginação separada
  const res = await Api.get('/acessos/ultimos').catch(() => null);
  if (!res?.ok) {
    tbody.innerHTML = `<tr><td colspan="4" style="text-align:center;color:var(--red);padding:32px">Erro ao carregar.</td></tr>`;
    return;
  }
  if (!res.dados.length) {
    tbody.innerHTML = `<tr><td colspan="4" style="text-align:center;color:var(--text-muted);padding:32px">Nenhum acesso registrado.</td></tr>`;
    return;
  }
  tbody.innerHTML = res.dados.map(a => `
    <tr>
      <td>
        <div style="font-weight:600">${a.alunoNome}</div>
        <div style="font-size:12px;color:var(--text-muted)">${a.alunoEmail}</div>
      </td>
      <td>${fmtDataHora(a.dataHoraAcesso)}</td>
      <td>${badgeStatus(a.status)}</td>
      <td style="color:var(--text-muted);font-size:12px">${a.observacao || '—'}</td>
    </tr>`).join('');
}

async function verAcessos(alunoId, nome) {
  const res = await Api.get(`/acessos/historico/${alunoId}?page=0&size=10`).catch(() => null);
  if (!res?.ok) return;
  navegarPara('acessos');
  const tbody = document.getElementById('tbody-acessos');
  const acessos = res.dados.content;
  document.getElementById('topbar-title').textContent = `Acessos — ${nome}`;
  if (!acessos.length) {
    tbody.innerHTML = `<tr><td colspan="4" style="text-align:center;color:var(--text-muted);padding:32px">Sem acessos registrados.</td></tr>`;
    return;
  }
  tbody.innerHTML = acessos.map(a => `
    <tr>
      <td><div style="font-weight:600">${a.alunoNome}</div></td>
      <td>${fmtDataHora(a.dataHoraAcesso)}</td>
      <td>${badgeStatus(a.status)}</td>
      <td style="color:var(--text-muted);font-size:12px">${a.observacao || '—'}</td>
    </tr>`).join('');
}

// ── MODAL: NOVO ALUNO ────────────────────────────────────
function abrirModalNovoAluno() {
  alunoEmEdicaoId = null;
  document.getElementById('modal-aluno-titulo').textContent = 'Novo Aluno';
  document.getElementById('m-nome').value = '';
  document.getElementById('m-email').value = '';
  document.getElementById('m-senha').value = '';
  document.getElementById('m-telefone').value = '';
  document.getElementById('m-cpf').value = '';
  document.getElementById('m-email').disabled = false;
  document.getElementById('m-senha').required = true;
  document.getElementById('btn-salvar-aluno').querySelector('.btn-text').textContent = 'Cadastrar';
  abrirModal('modal-aluno');
}

async function salvarAluno() {
  const btn = document.getElementById('btn-salvar-aluno');
  setLoading(btn, true);

  const body = {
    nome:      document.getElementById('m-nome').value.trim(),
    email:     document.getElementById('m-email').value.trim(),
    senha:     document.getElementById('m-senha').value || undefined,
    telefone:  document.getElementById('m-telefone').value.trim() || null,
    cpf:       document.getElementById('m-cpf').value.trim() || null,
    tipoPlano: document.getElementById('m-plano').value,
  };

  const res = await Api.post('/auth/cadastro', body).catch(() => null);
  setLoading(btn, false);

  if (!res?.ok) {
    mostrarMsg('msg-modal-aluno', res?.mensagem || 'Erro ao salvar.', 'error');
    return;
  }

  fecharModal('modal-aluno');
  carregarAlunos(document.getElementById('search-input').value);
}

// ── MODAL: RENOVAR PLANO ─────────────────────────────────
function abrirModalRenovar(id, nome) {
  alunoRenovarId = id;
  document.getElementById('renovar-aluno-nome').textContent = nome;
  document.getElementById('renovar-valor').value = '';
  abrirModal('modal-renovar');
}

async function confirmarRenovacao() {
  if (!alunoRenovarId) return;
  const btn = document.getElementById('btn-confirmar-renovar');
  setLoading(btn, true);

  const valorRaw = document.getElementById('renovar-valor').value;
  const body = {
    tipoPlano: document.getElementById('renovar-plano').value,
    valorPersonalizado: valorRaw ? parseFloat(valorRaw) : null,
  };

  const res = await Api.post(`/alunos/${alunoRenovarId}/renovar`, body).catch(() => null);
  setLoading(btn, false);

  if (!res?.ok) {
    mostrarMsg('msg-renovar', res?.mensagem || 'Erro ao renovar.', 'error');
    return;
  }

  fecharModal('modal-renovar');
  carregarAlunos(document.getElementById('search-input')?.value || '');
  if (document.getElementById('page-home').classList.contains('active')) carregarHome();
}

// ── ATIVAR / DESATIVAR ────────────────────────────────────
function alterarStatus(id, ativar, nome) {
  const acao = ativar ? 'ativar' : 'desativar';
  document.getElementById('confirm-titulo').textContent = `${ativar ? 'Ativar' : 'Desativar'} Aluno`;
  document.getElementById('confirm-texto').textContent  = `Deseja ${acao} o aluno "${nome}"?`;

  const btn = document.getElementById('btn-confirm-ok');
  btn.onclick = async () => {
    fecharModal('modal-confirm');
    const res = await Api.patch(`/alunos/${id}/status?ativo=${ativar}`).catch(() => null);
    if (res?.ok) carregarAlunos(document.getElementById('search-input')?.value || '');
  };
  abrirModal('modal-confirm');
}

// ── PERFIL ───────────────────────────────────────────────
async function carregarPerfil() {
  const res = await Api.get('/alunos/me').catch(() => null);
  if (!res?.ok) return;
  const a = res.dados;

  document.getElementById('perfil-avatar').textContent = iniciais(a.nome);
  document.getElementById('perfil-nome').textContent   = a.nome;
  document.getElementById('perfil-email').textContent  = a.email;
  document.getElementById('perfil-role').innerHTML     = `<span class="badge badge-blue">${roleLabel(a.role)}</span>`;

  document.getElementById('perf-nome').value      = a.nome;
  document.getElementById('perf-telefone').value  = a.telefone || '';

  const icon = !a.planoAtivo ? '❌' : a.diasRestantes <= 7 ? '⚠️' : '✅';
  document.getElementById('perfil-plano-icon').textContent = icon;
  document.getElementById('perfil-plano-nome').textContent = `Plano ${a.tipoPlano}`;
  document.getElementById('perfil-plano-venc').textContent = `Válido até ${fmtData(a.dataFimPlano)}`;
  document.getElementById('perfil-plano-badge').innerHTML  = badgePlano(a.diasRestantes, a.planoAtivo);
}

async function salvarPerfil(e) {
  e.preventDefault();
  const btn = e.target.querySelector('button[type="submit"]');
  setLoading(btn, true);

  const res = await Api.put(`/alunos/${usuario.id}`, {
    nome:      document.getElementById('perf-nome').value.trim(),
    telefone:  document.getElementById('perf-telefone').value.trim() || null,
  }).catch(() => null);

  setLoading(btn, false);

  if (!res?.ok) { mostrarMsg('msg-perfil', res?.mensagem || 'Erro.', 'error'); return; }
  mostrarMsg('msg-perfil', 'Dados atualizados com sucesso!', 'success');
  Storage.salvar(Storage.getToken(), { ...usuario, nome: res.dados.nome });
  renderizarSidebar();
}

async function salvarSenha(e) {
  e.preventDefault();
  const btn = e.target.querySelector('button[type="submit"]');
  setLoading(btn, true);

  const res = await Api.patch(`/alunos/${usuario.id}/senha`, {
    senhaAtual: document.getElementById('senha-atual').value,
    novaSenha:  document.getElementById('senha-nova').value,
  }).catch(() => null);

  setLoading(btn, false);

  if (!res?.ok) { mostrarMsg('msg-senha', res?.mensagem || 'Erro.', 'error'); return; }
  mostrarMsg('msg-senha', '✅ Senha alterada!', 'success');
  document.getElementById('form-senha').reset();
}

// ── Modais helpers ────────────────────────────────────────
function abrirModal(id)  { document.getElementById(id)?.classList.add('open'); }
function fecharModal(id) { document.getElementById(id)?.classList.remove('open'); }
