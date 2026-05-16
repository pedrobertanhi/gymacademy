const elBoasVindas = document.getElementById('boas-vindas');
const admin = PowerGym.admin();
const nome = admin && admin.nome ? admin.nome.split(' ')[0] : 'Admin';
elBoasVindas.innerText = `Bem-Vindo, ${nome}!`;
