/**
 * CATRACA — Tela de controle de acesso
 */

if (!Storage.logado()) window.location.href = '../index.html';

// ── Relógio em tempo real ─────────────────────────────────
function atualizarRelogio() {
  const agora = new Date();
  document.getElementById('relogio').textContent =
    agora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}
atualizarRelogio();
setInterval(atualizarRelogio, 1000);

// ── Ler email da URL ──────────────────────────────────────
const params = new URLSearchParams(window.location.search);
const email  = params.get('email');

// ── Chamar API ────────────────────────────────────────────
async function verificarAcesso() {
  if (!email) {
    mostrarResultado('alerta', '⚠️', 'E-MAIL INVÁLIDO', '', 'Nenhum e-mail foi informado na URL.', '');
    return;
  }

  try {
    const res = await Api.post('/acessos/liberar', { email });

    if (res?.ok) {
      const d = res.dados;
      mostrarResultado(
        'sucesso', '✅',
        'ACESSO LIBERADO',
        d.alunoNome || '',
        'Catraca aberta. Bom treino! 💪',
        `Entrada registrada às ${fmtHora(d.dataHora)}`
      );
    } else if (res?.status === 403) {
      mostrarResultado(
        'bloqueado', '❌',
        'ACESSO BLOQUEADO',
        '',
        res.mensagem || 'Plano vencido.',
        'Procure a recepção para renovar.'
      );
    } else if (res?.status === 404) {
      mostrarResultado(
        'alerta', '⚠️',
        'ALUNO NÃO ENCONTRADO',
        '',
        'O e-mail informado não está cadastrado.',
        email
      );
    } else {
      mostrarResultado('alerta', '⚠️', 'ERRO INESPERADO', '', res?.mensagem || 'Tente novamente.', '');
    }
  } catch (_) {
    mostrarResultado(
      'bloqueado', '🔌',
      'ERRO DE CONEXÃO',
      '',
      'Servidor fora do ar.',
      'Verifique se o back-end está rodando na porta 8080.'
    );
  }
}

function mostrarResultado(estado, icon, status, aluno, detalhe, data) {
  // Esconde loading
  document.getElementById('estado-loading').classList.add('hidden');
  document.getElementById('estado-resultado').classList.remove('hidden');

  // Aplica estado visual
  const corpo = document.getElementById('corpo');
  corpo.classList.remove('estado-sucesso', 'estado-bloqueado', 'estado-alerta');
  const mapa = { sucesso: 'estado-sucesso', bloqueado: 'estado-bloqueado', alerta: 'estado-alerta' };
  if (mapa[estado]) corpo.classList.add(mapa[estado]);

  // Preenche conteúdo
  document.getElementById('res-icon').textContent   = icon;
  document.getElementById('res-status').textContent = status;
  document.getElementById('res-aluno').textContent  = aluno;
  document.getElementById('res-detalhe').textContent = detalhe;
  document.getElementById('res-data').textContent    = data;

  // Auto-retorno após 5 segundos (para uso em modo quiosque)
  setTimeout(() => {
    window.location.href = `catraca.html?email=${encodeURIComponent(email || '')}`;
  }, 5000);
}

// Inicia
verificarAcesso();
