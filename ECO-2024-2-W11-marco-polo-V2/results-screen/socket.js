const socket = io('http://localhost:5050', { path: '/real-time' }); // Update this to your server URL

socket.on('connect', () => {
	console.log('Connected to Socket.IO server');
});

export default socket;

// const io = require('socket.io')(server);

// // Almacenar jugadores y sus puntuaciones en el servidor
// let players = {}; // { playerId: { score: 0, nickname: '', role: 'Marco' o 'Polo especial' }, ... }

// io.on('connection', (socket) => {
// 	// Evento cuando un jugador se une
// 	socket.on('playerJoined', (nickname) => {
// 		// Añadir el nuevo jugador con un puntaje inicial
// 		players[socket.id] = { score: 0, nickname: nickname, role: '' };

// 		// Enviar la lista de jugadores a todos
// 		io.emit('userJoined', { players: Object.values(players) });
// 	});

// 	// Asignar roles para la ronda
// 	socket.on('startGame', () => {
// 		// Lógica para asignar 'Marco' y 'Polo especial'
// 		let marcoId = selectRandomMarco(players); // Función que selecciona a Marco
// 		let poloEspecialId = selectRandomPoloEspecial(players); // Función que selecciona a Polo especial

// 		// Asignar roles a los jugadores
// 		Object.keys(players).forEach((playerId) => {
// 			if (playerId === marcoId) {
// 				players[playerId].role = 'Marco';
// 			} else if (playerId === poloEspecialId) {
// 				players[playerId].role = 'Polo especial';
// 			} else {
// 				players[playerId].role = 'Polo';
// 			}
// 		});

// 		// Notificar a todos los clientes los roles asignados
// 		io.emit('rolesAssigned', { players: Object.values(players) });
// 	});

// 	// Evento cuando termina la ronda
// 	socket.on('endRound', ({ marcoId, poloEspecialId, caughtSpecialPolo }) => {
// 		// Lógica de puntuación según el resultado de la ronda
// 		if (caughtSpecialPolo) {
// 			players[marcoId].score += 50;
// 			players[poloEspecialId].score -= 10;
// 		} else {
// 			players[marcoId].score -= 10;
// 			players[poloEspecialId].score += 10;
// 		}

// 		// Comprobar si algún jugador ha alcanzado los 100 puntos
// 		let winner = checkForWinner(players); // Función que retorna el ganador si existe

// 		if (winner) {
// 			// Notificar a los clientes el ganador
// 			io.emit('winnerDeclared', { winner: winner, players: Object.values(players) });
// 		} else {
// 			// Enviar las nuevas puntuaciones a todos los clientes
// 			io.emit('scoreUpdate', { players: Object.values(players) });
// 		}
// 	});

// 	// Evento para desconectar al jugador
// 	socket.on('disconnect', () => {
// 		delete players[socket.id];
// 		io.emit('userLeft', { players: Object.values(players) });
// 	});
// });

// // Función para seleccionar un jugador 'Marco' al azar
// function selectRandomMarco(players) {
// 	const playerIds = Object.keys(players);
// 	return playerIds[Math.floor(Math.random() * playerIds.length)];
// }

// // Función para seleccionar un 'Polo especial' al azar (diferente a 'Marco')
// function selectRandomPoloEspecial(players) {
// 	const poloPlayers = Object.keys(players).filter((id) => players[id].role !== 'Marco');
// 	return poloPlayers[Math.floor(Math.random() * poloPlayers.length)];
// }

// // Función para comprobar si algún jugador ha alcanzado los 100 puntos
// function checkForWinner(players) {
// 	for (let playerId in players) {
// 		if (players[playerId].score >= 100) {
// 			return players[playerId];
// 		}
// 	}
// 	return null;
// }

// export default socket;
