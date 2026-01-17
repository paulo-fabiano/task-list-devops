const BACKEND_URI = window.__ENV__.BACKEND_URI;

let tarefas = [];

function renderizarTabela() {
  const tbody = document.querySelector('#tabelaTarefas tbody');
  tbody.innerHTML = '';

  tarefas.forEach((tarefa, index) => {
    const tr = document.createElement('tr');
    tr.className = tarefa.realizado ? 'realizada' : 'pendente';

    const tdNome = document.createElement('td');
    const tdPrioridade = document.createElement('td');
    const tdStatus = document.createElement('td');
    const tdAcoes = document.createElement('td');

    if (tarefa.editando) {
      const inputNome = document.createElement('input');
      inputNome.value = tarefa.nome;
      inputNome.onchange = (e) => tarefa.nome = e.target.value;

      const inputPrioridade = document.createElement('input');
      inputPrioridade.value = tarefa.prioridade;
      inputPrioridade.onchange = (e) => tarefa.prioridade = e.target.value;

      tdNome.appendChild(inputNome);
      tdPrioridade.appendChild(inputPrioridade);

      const btnSalvar = document.createElement('button');
      btnSalvar.textContent = 'Salvar';
      btnSalvar.onclick = () => salvarEdicao(index);

      tdAcoes.appendChild(btnSalvar);
    } else {
      tdNome.textContent = tarefa.nome;
      tdPrioridade.textContent = tarefa.prioridade;

      const btnEditar = document.createElement('button');
      btnEditar.textContent = 'Editar';
      btnEditar.onclick = () => {
        tarefa.editando = true;
        renderizarTabela();
      };

      tdAcoes.appendChild(btnEditar);
    }

    tdStatus.textContent = tarefa.realizado ? 'Realizada' : 'Pendente';

    const btnStatus = document.createElement('button');
    btnStatus.textContent = tarefa.realizado ? 'Desmarcar' : 'Concluir';
    btnStatus.onclick = () => alternarStatus(index);

    const btnApagar = document.createElement('button');
    btnApagar.textContent = '🗑️';
    btnApagar.onclick = () => apagarTarefa(index);

    tdAcoes.appendChild(btnStatus);
    tdAcoes.appendChild(btnApagar);

    tr.appendChild(tdNome);
    tr.appendChild(tdPrioridade);
    tr.appendChild(tdStatus);
    tr.appendChild(tdAcoes);

    tbody.appendChild(tr);
  });
}

function adicionarTarefa() {
  const nome = document.getElementById('nome').value.trim();
  const prioridade = document.getElementById('prioridade').value.trim();

  if (nome === '') return alert('Digite um nome de tarefa');

  const novaTarefa = { nome, prioridade, realizado: false };

  axios.post(`${BACKEND_URI}/api/tarefa`, novaTarefa)
    .then(res => {
      const tarefaComId = res.data;
      tarefas.push({ ...tarefaComId, editando: false });
      renderizarTabela();
      document.getElementById('nome').value = '';
      document.getElementById('prioridade').value = '';
    })
    .catch(err => {
      console.error('Erro ao adicionar tarefa:', err);
      alert("Erro ao adicionar tarefa. Verifique o backend.");
    });
}

function salvarEdicao(index) {
  const tarefa = tarefas[index];

  axios.put(`${BACKEND_URI}/api/tarefa/atualizar/${tarefa.id}`, {
    nome: tarefa.nome,
    prioridade: tarefa.prioridade,
    realizado: tarefa.realizado
  })
  .then(() => {
    tarefa.editando = false;
    renderizarTabela();
  })
  .catch(err => {
    console.error('Erro ao editar tarefa:', err);
  });
}

function alternarStatus(index) {
  const tarefa = tarefas[index];
  tarefa.realizado = !tarefa.realizado;

  axios.put(`${BACKEND_URI}/api/tarefa/atualizar/${tarefa.id}`, { realizado: tarefa.realizado })
    .then(() => renderizarTabela())
    .catch(err => {
      console.error('Erro ao atualizar status:', err);
    });
}

function apagarTarefa(index) {
  const tarefa = tarefas[index];

  axios.delete(`${BACKEND_URI}/api/tarefa/deletar/${tarefa.id}`)
    .then(() => {
      tarefas.splice(index, 1);
      renderizarTabela();
    })
    .catch(err => {
      console.error('Erro ao apagar tarefa:', err);
    });
}

function carregarTarefas() {
  axios.get(`${BACKEND_URI}/api/tarefas`)
    .then(res => {
      tarefas = res.data.map(t => ({ ...t, editando: false }));
      renderizarTabela();
    })
    .catch(err => {
      console.error('Erro ao carregar tarefas:', err);
    });
}

carregarTarefas();

