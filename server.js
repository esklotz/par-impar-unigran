const http = require('http');
const url = require('url');
const S = require('string');
const mime = require('mime-types');
const fs = require('fs');
const WebSocket = require('ws');


const server = http.createServer((request, response) => {
	let diretorio = __dirname;
	let q = url.parse(request.url, true);
	q.pathname = (q.pathname == "/") ? "/par-impar.html" : q.pathname;
	let arquivo = S(q.pathname).splitLeft('/');
	let tipoArquivo = mime.lookup(arquivo[arquivo.length - 1]);
	fs.readFile(diretorio + q.pathname, (erro, html) => {
		if (erro) {
			response.writeHeader(404, { 'Content-Type': 'text/html' });
			response.write("Pagina invalida!");
			response.end();
		} else {
			response.writeHeader(200, { 'Content-Type': tipoArquivo });
			response.write(html);
			response.end();
		}
	});
});

server.listen(80);


const wsServer = new WebSocket.Server({ server: server });
const connections = [];
const users = []
const colors = ["blue", "pink"];
const tipo = ['par', 'impar']
const jogadores = {}
let jogadas = 0
wsServer.on('connection', (newConection) => {

	if (users.length == 2) {
		newConection.send(JSON.stringify({
			type: 'show-message',
			message: 'Apenas dois jogadores podem jogar ao mesmo tempo',
			sender: 'Servidor',
			color: 'red',
			side: 'right'
		}));
		return
	} 

	let newUser = {
		nome: "",
		cor: colors.shift()
	};
	connections.push(newConection);

	newConection.on('message', (message) => {
		console.log('received: %s', message);
		let json = JSON.parse(message);
		if (json.type == "set-name") {
			newUser.nome = json.message;
			users.push(newUser)

			jogadores[newUser.nome] = {
				tipo: tipo.shift(),
				numero: undefined
			}

			newConection.send(JSON.stringify({
				type: 'show-message',
				message: `${newUser.nome} voce é ${jogadores[newUser.nome].tipo}! Digite um numero de 1 a 10:`,
				sender: 'Servidor',
				color: 'orange',
				side: 'right'
			}));

			broadcastNewUserConnected(connections, newConection, newUser)

		} else if (json.type == "set-message") {

			if (!isValidNumber(json.message)) {
				sendInvalidValueMessage(newConection)
				return
			}

			jogadores[newUser.nome].numero = Number(json.message)
			jogadas++

			newConection.send(JSON.stringify({
				type: 'show-message',
				message: json.message,
				sender: newUser.nome,
				color: newUser.cor,
				side: 'left'
			}));

			broadcastNewUserChoseNumber(connections, newConection, newUser)

			if (jogadas == 2) {
				const result = findResult(jogadores, users)
				broadcastWinner(connections, result.ganhador, result.total)
			}

		}
	});

	newConection.send(JSON.stringify({
		type: 'show-message',
		message: 'Bem vindo ao jogo do Par ou Ímpar! Para Iniciar, digite o seu nome abaixo: ',
		sender: 'Servidor',
		color: 'orange',
		side: 'right'
	}));
});

const broadcastNewUserConnected = (connections, newConection, newUser) => {
	connections.forEach((conection) => {
		if (conection != newConection) {
			conection.send(JSON.stringify({
				type: 'show-message',
				message: `${newUser.nome} acabou de entrar`,
				sender: 'Sevidor',
				color: 'orange',
				side: 'right'
			}));
		}
	});
}

const broadcastNewUserChoseNumber = (connections, newConection, newUser) => {
	connections.forEach((connection) => {
		if (connection != newConection) {
			connection.send(JSON.stringify({
				type: 'show-message',
				message: `${newUser.nome} escolheu um numero.`,
				sender: 'Sevidor',
				color: 'orange',
				side: 'right'
			}));
		}
	});
}

const broadcastWinner = (connections, winnerName, total) => {
	connections.forEach((connection) => {
		connection.send(JSON.stringify({
			type: 'show-message',
			message: `A soma foi ${total} e o ganhador é ${winnerName}`,
			sender: 'Sevidor',
			color: 'green',
			side: 'right'
		}));
	});
}

const findResult = (jogadores, users) => {
	let total = 0
	users.forEach(user => {
		total = total + jogadores[user.nome].numero
	})

	const resultado = total % 2 === 0 ? 'par' : 'impar'

	let ganhador
	users.forEach(user => {
		if (jogadores[user.nome].tipo === resultado) {
			ganhador = user.nome
		}
	})

	return {
		ganhador,
		total
	}
}

const isValidNumber = (value) => {
	return !isNaN(value) & Number(value) > 0 & Number(value) <= 10
}

const sendInvalidValueMessage = (newConection) => {
	newConection.send(JSON.stringify({
		type: 'show-message',
		message: 'Por favor escolha um número de 1 à 10',
		sender: 'Servidor',
		color: 'red',
		side: 'right'
	}));
}