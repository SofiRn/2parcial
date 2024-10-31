import { router, socket } from '../routes.js'; // Importa router y socket

let players = {};
let winnerDeclared = false;

export default function renderScreen1() {
	const scoreScreen = document.getElementById('score-screen');
	const winnerScreen = document.getElementById('winner-screen');
	const scoreList = document.getElementById('score-list');
	const winnerMessage = document.getElementById('winner-message');
	const restartButton = document.getElementById('restart-button');
	const alphabeticalOrderButton = document.getElementById('alphabetical-order-button');
	const finalScoreList = document.getElementById('final-score-list');

	scoreScreen.style.display = 'flex';
	winnerScreen.style.display = 'none';

	socket.on('notifyGameOver', (data) => {
		console.log('Received notifyGameOver event:', data);
		const playersdata = data.updatedPlayers.players;
		console.log('data players in notify', playersdata);

		renderPlayersList(playersdata);
	});

	socket.on('declareWinner', (data) => {
		declareWinner(data.winner, data.players);
	});

	function renderScoreList(data) {
		console.log('in render score', data);

		scoreList.innerHTML = '';
		const sortedPlayers = Object.values(data).sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
		sortedPlayers.forEach((player) => {
			const li = document.createElement('li');
			li.innerText = `${player.nickname}: ${player.score ?? 0} pts`; // Mostrar 0 si `score` está undefined
			scoreList.appendChild(li);
		});
	}

	function checkWinner(data) {
		console.log('check winner ', data);

		const potentialWinner = Object.values(data).find((player) => (player.score ?? 0) >= 100);
		if (potentialWinner && !winnerDeclared) {
			socket.emit('declareWinner', potentialWinner);
		}
	}

	function declareWinner(winningPlayer, finalPlayers) {
		winnerDeclared = true;
		winnerScreen.style.display = 'flex';
		scoreScreen.style.display = 'none';
		winnerMessage.innerText = `¡Felicidades ${winningPlayer.nickname}, ganaste con ${winningPlayer.score ?? 0} puntos!`;

		finalScoreList.innerHTML = '';
		finalPlayers
			.sort((a, b) => (b.score ?? 0) - (a.score ?? 0))
			.forEach((player, index) => {
				const li = document.createElement('li');
				li.innerText = `${index + 1}. ${player.nickname} (${player.score ?? 0} pts)`;
				finalScoreList.appendChild(li);
			});
	}

	restartButton.addEventListener('click', () => {
		winnerDeclared = false;
		players = {};
		winnerScreen.style.display = 'none';
		scoreScreen.style.display = 'block';
		renderScoreList();
		socket.emit('restartGame');
	});

	alphabeticalOrderButton.addEventListener('click', () => {
		const sortedPlayers = Object.values(players).sort((a, b) => a.nickname.localeCompare(b.nickname));
		scoreList.innerHTML = '';
		sortedPlayers.forEach((player) => {
			const li = document.createElement('li');
			li.innerText = `${player.nickname}: ${player.score ?? 0} pts`;
			scoreList.appendChild(li);
		});
	});

	socket.on('userJoined', (data) => {
		console.log('jugadores entrando', data);

		// data.players.forEach((player) => {
		// 	if (!players[player.nickname]) {
		// 		players[player.nickname] = { ...player, score: player.score ?? 0 };
		// 	}
		// });
		renderScoreList(data.updatedPlayers);
		console.log('user entran', data.updatedPlayers);
	});

	socket.on('startGame', (data) => {
		console.log('start game');

		updateScore(data.playerId, data.role, data.caughtSpecialPolo);
	});

	// function updateScore(playerId, role, caughtSpecialPolo) {
	// 	console.log('in function update');

	// 	if (!players[playerId]) {
	// 		players[playerId] = { id: playerId, score: 0, nickname: '' };
	// 	}

	// 	if (role === 'Marco') {
	// 		players[playerId].score += caughtSpecialPolo ? 50 : -10;
	// 	} else if (role === 'Polo especial') {
	// 		players[playerId].score += caughtSpecialPolo ? -10 : 10;
	// 	}

	// 	renderScoreList();
	// 	checkWinner();
	// }
	// console.log('Si lo esta llamando', updateScore.caughtSpecialPolo);
}

// import { router, socket } from '../routes.js'; // Importa router y socket
// import io from '../socket.js';

// // Conexión al servidor con Socket.IO
// // const socket = io('http://localhost:5050', { path: '/real-time' });

// let players = {}; // Almacena jugadores y sus puntuaciones
// // let winnerDeclared = false;
// export default function renderScreen1() {
// 	// Elementos de la pantalla
// 	const scoreScreen = document.getElementById('score-screen');
// 	const winnerScreen = document.getElementById('winner-screen');
// 	const scoreList = document.getElementById('score-list');
// 	const winnerMessage = document.getElementById('winner-message');
// 	const restartButton = document.getElementById('restart-button');
// 	const alphabeticalOrderButton = document.getElementById('alphabetical-order-button');
// 	const finalScoreList = document.getElementById('final-score-list');

// 	// Mostrar solo la pantalla de puntuaciones inicialmente
// 	scoreScreen.style.display = 'flex';
// 	winnerScreen.style.display = 'none';

// 	socket.on('updateScore', (data) => {
// 		console.log('Datos de updateScore recibidos:', data);
// 		const { username, score } = data;

// 		// Verifica que `username` y `score` existan y actualiza el puntaje del jugador correspondiente
// 		if (username && score !== undefined) {
// 			if (!players[username]) {
// 				// Si el jugador no existe, agrégalo
// 				players[username] = { id: username, nickname: username, score: 0 };
// 			}
// 			// Actualiza el puntaje del jugador y renderiza la lista de puntuaciones
// 			players[username].score = score;
// 			renderScoreList();
// 			checkWinner(); // Verifica si alguien ganó
// 		} else {
// 			console.error('Datos inválidos recibidos:', data);
// 		}
// 	});

// 	// Función para actualizar la puntuación
// 	function updateScore(playerId, role, caughtSpecialPolo) {
// 		if (!players[playerId]) {
// 			players[playerId] = { id: playerId, score: 0, nickname: '' };
// 		}

// 		if (role === 'Marco') {
// 			players[playerId].score += caughtSpecialPolo ? 50 : -10;
// 		} else if (role === 'Polo especial') {
// 			players[playerId].score += caughtSpecialPolo ? -10 : 10;
// 		}

// 		renderScoreList(); // Actualizar pantalla de puntuaciones
// 		checkWinner(); // Comprobar si hay un ganador
// 	}

// 	// Renderizar la lista de puntuaciones
// 	function renderScoreList() {
// 		scoreList.innerHTML = ''; // Limpiar la lista
// 		const sortedPlayers = Object.values(players).sort((a, b) => b.score - a.score); // Ordenar por puntuación
// 		sortedPlayers.forEach((player) => {
// 			const li = document.createElement('li');
// 			li.innerText = `${player.nickname}: ${player.score} pts`;
// 			scoreList.appendChild(li);
// 		});
// 	}

// 	// Función para comprobar si hay un ganador
// 	function checkWinner() {
// 		const potentialWinner = Object.values(players).find((player) => player.score >= 100);
// 		if (potentialWinner && !winnerDeclared) {
// 			declareWinner(potentialWinner);
// 		}
// 	}

// 	// Función para declarar al ganador y mostrar pantalla
// 	function declareWinner(winningPlayer) {
// 		winnerDeclared = true;
// 		winnerScreen.style.display = 'flex';
// 		scoreScreen.style.display = 'none';
// 		winnerMessage.innerText = `¡Felicidades ${winningPlayer.nickname} es el ganador con ${winningPlayer.score} puntos!`;

// 		// Mostrar lista final de puntuaciones
// 		finalScoreList.innerHTML = '';
// 		const sortedPlayers = Object.values(players).sort((a, b) => b.score - a.score);
// 		sortedPlayers.forEach((player, index) => {
// 			const li = document.createElement('li');
// 			li.innerText = `${index + 1}. ${player.nickname} (${player.score} pts)`;
// 			finalScoreList.appendChild(li);
// 		});
// 		Object.values(players).forEach((player) => (player.score = 0));
// 	}

// 	// Reiniciar juego
// 	restartButton.addEventListener('click', () => {
// 		winnerDeclared = false;
// 		players = {}; // Reiniciar puntuaciones
// 		winnerScreen.style.display = 'none';
// 		scoreScreen.style.display = 'block';
// 		renderScoreList();
// 	});

// 	// Botón para ordenar jugadores alfabéticamente
// 	alphabeticalOrderButton.addEventListener('click', () => {
// 		const sortedPlayers = Object.values(players).sort((a, b) => a.nickname.localeCompare(b.nickname));
// 		scoreList.innerHTML = '';
// 		sortedPlayers.forEach((player) => {
// 			const li = document.createElement('li');
// 			li.innerText = `${player.nickname}: ${player.score} pts`;
// 			scoreList.appendChild(li);
// 		});
// 	});

// 	// Escuchar eventos desde el servidor
// 	socket.on('userJoined', (data) => {
// 		const playersJoined = data.players || [];
// 		playersJoined.forEach((player) => {
// 			if (!players[player.id]) {
// 				players[player.id] = { id: player.id, score: player.score || 0, nickname: player.nickname };
// 			}
// 		});
// 		renderScoreList();

// 		socket.emit('updateScore', 'Hola');
// 	});

// 	socket.on('startGame', (data) => {
// 		const { playerId, role, caughtSpecialPolo } = data;
// 		updateScore(playerId, role, caughtSpecialPolo);
// 	});

// 	socket.on('updateScores', (data) => {
// 		// console.log('Datos de updateScore recibidos:', data);
// 		// const { username, score } = data;

// 		// // Verifica que `username` y `score` existan
// 		// if (username && score !== undefined) {
// 		// 	console.log(`Usuario: ${username}, Puntaje: ${score}`);
// 		// } else {
// 		// 	console.error('Datos inválidos recibidos:', data);
// 		// }

// 		console.log('Evento cliente updateScore pantalla resultados');
// 		console.log(data);

// 		renderScoreList();
// 	});

// 	// socket.on('updateScores', (updatedPlayers) => {
// 	// 	players = {};
// 	// 	updatedPlayers.forEach((player) => {
// 	// 		players[player.id] = player;
// 	// 	});
// 	// 	renderScoreList();
// 	// });

// 	socket.on('declareWinner', (data) => {
// 		const winningPlayer = { nickname: data.winner, score: 100 };
// 		declareWinner(winningPlayer);
// 	});

// 	socket.on('ayuda', () => {
// 		console.log();
// 	});
// }
