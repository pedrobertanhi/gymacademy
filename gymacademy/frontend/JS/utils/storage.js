/**
 * STORAGE — GymAcademy
 * Gerencia sessão do usuário e funções utilitárias.
 */

const Storage = (() => {
  const KEYS = { TOKEN: 'ga_token', USUARIO: 'ga_usuario' };

  return {
    salvar(token, usuario) {
      sessionStorage.setItem(KEYS.TOKEN,   token);
      sessionStorage.setItem(KEYS.USUARIO, JSON.stringify(usuario));
    },
    getToken()   { return sessionStorage.getItem(KEYS.TOKEN) || ''; },
    getUsuario() {
      const raw = sessionStorage.getItem(KEYS.USUARIO);
      return raw ? JSON.parse(raw) : null;
    },
    limpar() {
      sessionStorage.removeItem(KEYS.TOKEN);
      sessionStorage.removeItem(KEYS.USUARIO);
    },
    logado() { return !!this.getToken(); },
  };
})();

// ── Helpers de formatação ──────────────────────────────────────

function fmtData(iso) {
  if (!iso) return '—';
  const [a, m, d] = iso.split('-');
  return `${d}/${m}/${a}`;
}

function fmtDataHora(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('pt-BR');
}

function fmtHora(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

function fmtMoeda(valor) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor || 0);
}

function iniciais(nome = '') {
  return nome.trim().split(' ').slice(0, 2).map(p => p[0]).join('').toUpperCase();
}

function badgePlano(diasRestantes, planoAtivo) {
  if (!planoAtivo || diasRestantes <= 0)
    return `<span class="badge badge-red">❌ Vencido</span>`;
  if (diasRestantes <= 7)
    return `<span class="badge badge-yellow">⚠️ ${diasRestantes}d restantes</span>`;
  return `<span class="badge badge-green">✅ ${diasRestantes}d restantes</span>`;
}

function badgeStatus(status) {
  if (status === 'LIBERADO')
    return `<span class="badge badge-green">✅ Liberado</span>`;
  return `<span class="badge badge-red">❌ Bloqueado</span>`;
}

function mostrarMsg(idOuEl, texto, tipo = 'error') {
  const el = typeof idOuEl === 'string' ? document.getElementById(idOuEl) : idOuEl;
  if (!el) return;
  el.textContent = texto;
  el.className = `msg-box msg-${tipo === 'success' ? 'success' : tipo === 'warning' ? 'warning' : 'error'}`;
  el.classList.remove('hidden');
  setTimeout(() => el.classList.add('hidden'), 5000);
}

function setLoading(btn, loading) {
  const text   = btn.querySelector('.btn-text');
  const loader = btn.querySelector('.btn-loader');
  btn.disabled = loading;
  if (text)   text.classList.toggle('hidden', loading);
  if (loader) loader.classList.toggle('hidden', !loading);
}
