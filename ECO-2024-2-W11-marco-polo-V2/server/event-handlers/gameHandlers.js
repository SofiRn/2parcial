// gameHandlers.js

const { assignRoles } = require('../utils/helpers');

// Assuming db and io are required or passed in some way to be accessible
const joinGameHandler = (socket, db, io) => {
	return (user) => {
		db.players.push({ id: socket.id, ...user, score: 0 });
		console.log('players in joingemhandler', db.players);
		io.emit('userJoined', db); // Broadcasts the message to all connected clients including the sender
	};
};

const startGameHandler = (socket, db, io) => {
	// AQUI ES DIFERENTE
	return () => {
		db.players = assignRoles(db.players);

		db.players.forEach((element) => {
			io.to(element.id).emit('startGame', element.role);
		});
	};
};

const notifyMarcoHandler = (socket, db, io) => {
	return () => {
		const rolesToNotify = db.players.filter((user) => user.role === 'polo' || user.role === 'polo-especial');

		rolesToNotify.forEach((element) => {
			io.to(element.id).emit('notification', {
				message: 'Marco!!!',
				userId: socket.id,
			});
		});
		console.log('notificando marco');
	};
};

const notifyPoloHandler = (socket, db, io) => {
	return () => {
		const rolesToNotify = db.players.filter((user) => user.role === 'marco');

		rolesToNotify.forEach((element) => {
			io.to(element.id).emit('notification', {
				message: 'Polo!!',
				userId: socket.id,
			});

			console.log('notificando marco');
		});
	};
};

// const onSelectPoloHandler = (socket, db, io) => {
// 	return (userID) => {
// 		const myUser = db.players.find((user) => user.id === socket.id);
// 		const poloSelected = db.players.find((user) => user.id === userID);

// 		if (poloSelected.role === 'polo-especial') {
// 			// Notify all players that the game is over
// 			db.players.forEach((element) => {
// 				io.to(element.id).emit('notifyGameOver', {
// 					message: `El marco ${myUser.nickname} ha ganado, ${poloSelected.nickname} ha sido capturado`,
// 				});
// 			});
// 		} else {
// 			db.players.forEach((element) => {
// 				io.to(element.id).emit('notifyGameOver', {
// 					message: `El marco ${myUser.nickname} ha perdido`,
// 				});
// 			});
// 		}
// 	};
// };

const updateScoreHandler = (socket, db, io) => {
	return (score) => {
		console.log('Hola prueba');
		console.log(db);
		const player = db.players.find((user) => user.id === socket.id);

		console.log(player);
		socket.emit('ayuda', db.players);

		if (player) {
			player.score += score;

			// Emit score update to all clients
			io.emit('updateScores', db.players);

			// Check if any player has reached 100 points
			if (player.score >= 100) {
				io.emit('declareWinner', { winner: player.nickname });
				// db.players = [];
				db.players.forEach((p) => (p.score = 0));
			}
		}

		io.emit('updateScores', db.players);
	};
};

const onSelectPoloHandler = (socket, db, io) => {
	return (userID) => {
		const myUser = db.players.find((user) => user.id === socket.id);
		const poloSelected = db.players.find((user) => user.id === userID);
		const poloEspecial = db.players.find((user) => user.role === 'polo-especial');

		let message = '';
		let winner = null;

		if (poloSelected.role === 'polo-especial') {
			// Marco catches Polo Especial
			myUser.score += 50; // Marco gains 50 points
			poloSelected.score -= 10; // Polo Especial loses 10 points
			message = `El marco ${myUser.nickname} ha atrapado al polo especial ${poloSelected.nickname}. Marco gana 50 puntos, Polo Especial pierde 10 puntos.`;
		} else if (poloSelected.role === 'polo') {
			// Marco fails to catch Polo Especial
			myUser.points -= 10; // Marco loses 10 points
			poloEspecial.points += 10; // Polo Especial gains 10 points
			message = `El marco ${myUser.nickname} no logró atrapar al polo especial. Marco pierde 10 puntos, Polo Especial gana 10 puntos.`;
		}

		// Check if anyone has reached 100 points
		const players = [myUser, poloSelected, poloEspecial];
		winner = players.find((player) => player.score >= 100);

		if (winner) {
			message = `¡${winner.nickname} ha ganado el juego con ${winner.score} puntos! 🏆`;
		}

		io.emit('notifyGameOver', {
			message: message,
			updatedPlayers: db.players,
			winner: winner,
		});
	};
};

module.exports = {
	joinGameHandler,
	startGameHandler,
	notifyMarcoHandler,
	notifyPoloHandler,
	onSelectPoloHandler,
	updateScoreHandler,
};
