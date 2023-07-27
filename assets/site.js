var appForm = document.getElementById('app-form');
mostrarLista();

var pessoas = [];

appForm.onsubmit = addPessoa; //O evento onsubmit ocorre quando um formulário é enviado


//FUNÇÃO PARA ADICIONAR PESSOA 
function addPessoa(e) {
	e.preventDefault(); // evita recarregar a página com o envio do formulário.

	var nome = e.target.pessoaNome.value;
	var sobrenome = e.target.pessoaSobrenome.value;
	var telefone = e.target.pessoaTelefone.value;

	var pessoa = { nome, sobrenome, telefone };

	if (validarCampos(pessoa)) {
		// mandamos via post para o arquivo em php para fazer a manipulação dos dados no banco
		fetch("models/insert_contato.php", {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(pessoa)
		}).then(response => {
			if (response.status) {
				//pessoas.push(pessoa);
				appForm.reset();
				mostrarLista();
				elemento_mensagem.classList.remove('visually-hidden');
				elemento_mensagem.classList.add('alert-info');
				elemento_mensagem.innerHTML = 'Dados Enviados <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>';

			} else {
				elemento_mensagem.classList.remove('alert-info', 'visually-hidden');
				elemento_mensagem.classList.add('alert-danger');
				elemento_mensagem.innerHTML = 'Erro ao enviar os dados <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>';

			}
			hiddemAlert(elemento_mensagem);
		}
		).catch(error => {
			console.log("Ocorreu um erro!" + error)
		}
		)
	}

}

//FUNÇÃO PARA VALIDAR CAMPOS
function validarCampos(pessoa) {

	if (pessoa.nome.length === 0) {
		hiddemAlert(elemento_mensagem);
		elemento_mensagem.classList.remove('alert-info', 'visually-hidden');
		elemento_mensagem.classList.add('alert-danger');
		elemento_mensagem.innerHTML = 'Preencha o campo Nome <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>';
		return;
	}
	else if (pessoa.sobrenome.length === 0) {
		hiddemAlert(elemento_mensagem);
		elemento_mensagem.classList.remove('alert-info', 'visually-hidden');
		elemento_mensagem.classList.add('alert-danger');
		elemento_mensagem.innerHTML = 'Preencha o campo Sobrenome <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>';
		return;
	}
	else if (pessoa.telefone.length < 10) {
		hiddemAlert(elemento_mensagem);
		elemento_mensagem.classList.remove('alert-info', 'visually-hidden');
		elemento_mensagem.classList.add('alert-danger');
		elemento_mensagem.innerHTML = 'Preencha o campo Telefone corretamente <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>';
		return;
	}
	return true;
	//esse true precisamos fazer que volte o botão azul
}

// FUNÇÃO PARA MOSTRAR A LISTA DE CONTATOS
function mostrarLista() {
	pessoas = [];
	// usamos a função get para buscar os contatos
	var xhr = new XMLHttpRequest(); 	// xhr faz a requisição dos dados sem atualizar a página
	xhr.open("GET", "models/listar_contatos.php", true);

	xhr.onreadystatechange = function () {
		if (xhr.readyState === 4 && xhr.status === 200) {
			var retorno = xhr.responseText;

			retornoPessoas = JSON.parse(retorno);
			// for foreach retornoPessoas gravar no array pessoas[id]
			retornoPessoas.forEach(element => {
				pessoas[element.id] = element;
			});

			listaPessoas.innerHTML = '';

			atualizarLista(pessoas);
		}
	};
	xhr.send();
}

// FUNÇÃO PARA REMOVER PESSOA
function removerPessoa(id) {
	var pessoa = { id }
	fetch("models/remover_contato.php", {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(pessoa)
	}).then(response => {

		mostrarLista();

		if (response.status) {
			hiddemAlert(elemento_mensagem);
			elemento_mensagem.classList.remove('visually-hidden');
			elemento_mensagem.classList.add('alert-info');
			elemento_mensagem.innerHTML = 'Dados removidos com sucesso <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>';

		} else {
			hiddemAlert(elemento_mensagem);
			elemento_mensagem.classList.remove('alert-info', 'visually-hidden');
			elemento_mensagem.classList.add('alert-danger');
			elemento_mensagem.innerHTML = 'Erro ao remover os dados <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>';
		}
	}
	).catch(error => {
		alert('Ocorreu um erro! <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>' + error)
	}
	)
}

// FUNÇÃO PARA ALTERAR CONTATO
function alterarPessoa(indice) {
	var btnCadastrar = document.getElementById('btnCadastrar');
	var btnEditar = document.getElementById('btnEditar');
	var input_nome = document.getElementById('pessoaNome');
	var input_sobrenome = document.getElementById('pessoaSobrenome');
	var input_telefone = document.getElementById('pessoaTelefone');
	btnCadastrar.setAttribute('style', 'display:none');
	btnEditar.setAttribute('style', 'display:');

	input_nome.value = pessoas[indice].nome;
	input_sobrenome.value = pessoas[indice].sobrenome;
	input_telefone.value = pessoas[indice].numero;
	console.log(pessoas);

	btnEditar.onclick = function editarPessoa() {
		var pessoaAlterada = {
			id: indice,
			nome: input_nome.value,
			sobrenome: input_sobrenome.value,
			telefone: input_telefone.value,
		};

		if (validarCampos(pessoaAlterada)) {
			input_nome.value = '';
			input_sobrenome.value = '';
			input_telefone.value = '';

			btnCadastrar.setAttribute('style', 'display:');
			btnEditar.setAttribute('style', 'display:none');

			pessoas[indice] = pessoaAlterada;

			fetch("models/editar_contato.php", {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(pessoaAlterada) // Foi alterado para a variavel que vai receber os dados
			}).then(response => {
				if (response.status) {
					mostrarLista();
					hiddemAlert(elemento_mensagem);
					elemento_mensagem.classList.remove('visually-hidden');
					elemento_mensagem.classList.add('alert-info');
					elemento_mensagem.innerHTML = 'Contato Editado <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>';
				} else {
					hiddemAlert(elemento_mensagem);
					elemento_mensagem.classList.remove('alert-info', 'visually-hidden');
					elemento_mensagem.classList.add('alert-danger');
					elemento_mensagem.innerHTML = 'Não foi possível editar o contato <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>';
				}
			}).catch(error => {
				alert("Ocorreu um erro!" + error);
			});

			mostrarLista();
		}
	};
}


// FUNÇÃO PARA FAVORITAR CONTATO 
function favoritarContato(id) {

	fetch("models/favoritar_contato.php", {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(id)
	}).then(response => {

		if (response.status) {
			mostrarLista();
			hiddemAlert(elemento_mensagem);
			elemento_mensagem.classList.remove('visually-hidden');
			elemento_mensagem.classList.add('alert-info');
			elemento_mensagem.innerHTML = 'Pessoa Favoritada <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>';
		} else {
			hiddemAlert(elemento_mensagem);
			elemento_mensagem.classList.remove('alert-info', 'visually-hidden');
			elemento_mensagem.classList.add('alert-danger');
			elemento_mensagem.innerHTML = 'Não foi possível favoritar o contato <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>';
		}
	}
	).catch(error => {
		alert("Ocorreu um erro!" + error)
	}
	)
}


//FUNÇÃO MOSTRAR FAVORITOS - usar checkbox quando estar marcado mostra favoritos e desmarcado mostra tudo
//ver se o addEventListener vendo se o checkbox esta checked

var checkbox = document.getElementById("botaoFavoritos");

checkbox.addEventListener('change', function () {
	if (this.checked) {
		var favorito = 1;
		// Checkbox está selecionado.
		fetch('models/listar_favoritos.php', {
			method: 'POST', // enviamos os dados de forma de requisição POST
			headers: {
				'Content-Type': 'application/json' // queremos o retorno de forma JSON
			},
			body: JSON.stringify(favorito) // Enviamos os dados de forma JSON
		})
			.then(response => response.json()) // O retorno do formato JSON que pedimos lã em cima
			.then(data => { // a variavel data é a os dados que vem da variavel response.json(), convertendo ele para um array
				// Faça algo com os dados JSON retornados
				listaPessoas.innerHTML = '';// Limpamos lista
				atualizarLista(data); // Chamamos a função atualizarLista, para atualizar a lista na tela			
			})
			.catch(error => {
				alert("Ocorreu um erro! Consutle o suporte!");
			});

	} else {
		// Checkbox não está selecionado.
		mostrarLista();
	}
});


// FUNÇÃO PARA PESQUISAR
function pesquisarContato() {
	var nome = document.getElementById('campoPesquisa').value;

	fetch("models/pesquisar_contato.php", {
		method: 'POST', // enviamos os dados de forma de requisição POST 
		headers: {
			'Content-Type': 'application/json' // queremos o retorno de forma JSON 
		},
		body: JSON.stringify(nome) // Enviamos os dados de forma JSON 
	})
		.then(response => response.json()) // O retorno do formato JSON que pedimos la em cima 
		.then(data => {
			if (data.length === 0) { //se data.length for igual a zero, ou seja não obter resposta vai executar o alert
				listaPessoas.innerHTML = '';
				hiddemAlert(elemento_mensagem);
				elemento_mensagem.classList.remove('alert-info', 'visually-hidden');
				elemento_mensagem.classList.add('alert-danger');
				elemento_mensagem.innerHTML = 'Não foi possível localizar o contato <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>';
				mostrarLista();
			} else {
				listaPessoas.innerHTML = '';// Limpamos lista 
				atualizarLista(data); // Chamamos a função atualizarLista, para atualizar a lista na tela    
			}
		})
		.catch(error => {
			console.error('Erro na requisição:', error);

		});
}


//FUNÇÃO PARA LIMPAR A PESQUISA E VOLTAR A MOSTRAR A ÇOSTA COMPLETA
function limparPesquisa() {
	var nome = document.getElementById('campoPesquisa');
	nome.value = '';

	mostrarLista();

}
//FUNÇÃO PARA ATUALIZAR A LISTA DE CONTATOS E DE PESQUISA
//ver para usar um foreach para consertar isso aqui
function atualizarLista(lista) {

	lista.forEach(element => {
		var nomeEl = document.createElement('strong');
		nomeEl.appendChild(document.createTextNode(element['nome'] + ' ' + element['sobrenome']));

		var telefoneEl = document.createElement('p');
		telefoneEl.appendChild(document.createTextNode('Telefone: ' + element['numero']));

		var removerEl = document.createElement('a');
		removerEl.setAttribute('href', '#');
		var iconeRemover = document.createElement('i');
		iconeRemover.classList.add('bi', 'bi-trash', 'me-1');
		removerEl.appendChild(iconeRemover);
		var removerText = document.createTextNode('Remover');
		removerEl.appendChild(removerText);
		removerEl.setAttribute('onclick', 'removerPessoa(' + element['id'] + ')');
		removerEl.classList.add('btn', 'btn-danger', 'me-2');

		var favoritarEl = document.createElement('a');
		favoritarEl.setAttribute('href', '#');
		var iconeFavorito = document.createElement('i');
		iconeFavorito.classList.add('bi', 'bi-star-fill', 'me-1');
		favoritarEl.appendChild(iconeFavorito);
		var favoritarText = document.createTextNode('Favoritar');
		favoritarEl.appendChild(favoritarText);
		favoritarEl.setAttribute('onclick', 'favoritarContato(' + element['id'] + ')');
		favoritarEl.classList.add('btn', 'btn-warning', 'me-2');

		var alterarEl = document.createElement('a');
		alterarEl.setAttribute('href', '#');
		var iconeEditar = document.createElement('i');
		iconeEditar.classList.add('bi', 'bi-pencil', 'me-1');
		alterarEl.appendChild(iconeEditar);
		var alterarText = document.createTextNode('Alterar');
		alterarEl.appendChild(alterarText);
		alterarEl.setAttribute('onclick', 'alterarPessoa(' + element['id'] + ')');
		alterarEl.classList.add('btn', 'btn-info', 'me-2');

		var itemEl = document.createElement('li');
		itemEl.classList.add('list-group-item', 'p-4');
		itemEl.appendChild(nomeEl);
		itemEl.appendChild(telefoneEl);
		itemEl.appendChild(removerEl);
		itemEl.appendChild(alterarEl);
		itemEl.appendChild(favoritarEl); //É um NÓ filho para chamar a variavel pai
		listaPessoas.appendChild(itemEl);
	});
}


//Função e variável correspondentes aos Alerts
function hiddemAlert(element) {
	setTimeout(() => {
		elemento_mensagem.classList.remove('alert-info', 'alert-danger');
		element.classList.add('visually-hidden');
	}, 2000);
}
var elemento_mensagem = document.getElementById('mensagem');