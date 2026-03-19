/**
 * API CLIENT — GymAcademy
 * Wrapper em torno do fetch com JWT automático e tratamento de erros.
 */

const API_BASE = 'http://localhost:8080/api';

const Api = (() => {

  function getToken() {
    return sessionStorage.getItem('ga_token') || '';
  }

  function headers(extra = {}) {
    const h = { 'Content-Type': 'application/json', ...extra };
    const token = getToken();
    if (token) h['Authorization'] = 'Bearer ' + token;
    return h;
  }

  async function request(method, path, body = null) {
    const opts = { method, headers: headers() };
    if (body) opts.body = JSON.stringify(body);

    const res = await fetch(API_BASE + path, opts);

    // Token expirado → volta ao login
    if (res.status === 401) {
      Storage.limpar();
      window.location.href = '/index.html';
      return;
    }

    const json = await res.json().catch(() => ({ mensagem: 'Erro inesperado.' }));
    return { ok: res.ok, status: res.status, ...json };
  }

  return {
    get:    (path)         => request('GET',    path),
    post:   (path, body)   => request('POST',   path, body),
    put:    (path, body)   => request('PUT',     path, body),
    patch:  (path, body)   => request('PATCH',  path, body),
    delete: (path)         => request('DELETE', path),
  };
})();
