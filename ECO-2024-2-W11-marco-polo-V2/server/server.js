const { createServer } = require('http');

const app = require('./app.js');
const { initSocket } = require('./socket.js');

const httpServer = createServer(app); // Explicity creates an HTTP server from the Express app

// Initialize Socket.IO
initSocket(httpServer);

httpServer.listen(5050, () => console.log('server starting 🚀🆙✔ on http://localhost:5050'));




// const { createServer } = require('http');
// const express = require('express');
// // const apps = express();
// // apps.use(express.static('./app.js'));

// const app = require('./app.js');
// const { initSocket } = require('./socket.js');

// const httpServer = createServer(app); // Explicity creates an HTTP server from the Express app
// // Initialize Socket.IO
// initSocket(httpServer);

// httpServer.listen(5050, () => console.log('server starting 🚀🆙✔ on http://localhost:5050'));

// // Initialize Socket.IO
// initSocket(httpServer);

// let players = {}; // Diccionario para almacenar puntajes de cada jugador

// io.on('connection', (socket) => {
//     socket.on('registerPlayer', (username) => {
//         players[username] = 0;
//         io.emit('updatePlayers', players); // Enviar datos de los jugadores al cliente
//     });

//     socket.on('updateScore', ({ username, points }) => {
//         players[username] += points;
//         io.emit('updatePlayers', players);

//         // Verificar si alguien alcanzó o superó 100 puntos
//         if (players[username] >= 100) {
//             io.emit('gameOver', { winner: username, players });
//         }
//     });

//     socket.on('disconnect', () => {
//         delete players[socket.username];
//         io.emit('updatePlayers', players);
//     });
// });

// httpServer.listen(5050, () => console.log('server starting 🚀🆙✔ on http://localhost:5050'));

// const express = require('express');
// const http = require('http');
// const socketIo = require('socket.io');

// const app = express();
// const server = http.createServer(app);
// const io = socketIo(server, {
// 	path: '/real-time',
// });

// app.use(express.static('public'));
// // app.use(express.static(path.join(__dirname, 'public')));

// let scores = {}; // Almacena las puntuaciones de cada jugador
// let winner = null;

// // Evento de conexión
// io.on('connection', (socket) => {
// 	console.log('Nuevo cliente conectado');

// 	// Escuchar evento de unión de usuario
// 	socket.on('userJoined', (username) => {
// 		scores[username] = 0; // Inicializar puntuación
// 		io.emit('updateScores', scores); // Enviar puntuaciones actualizadas a todos los clientes
// 	});

// 	// Escuchar evento de actualización de puntuación
// 	socket.on('updateScore', (username) => {
// 		if (scores[username] !== undefined) {
// 			scores[username] += 10; // Incrementar puntuación
// 			if (scores[username] >= 100 && !winner) {
// 				winner = username;
// 				io.emit('declareWinner', winner);
// 			} else {
// 				io.emit('updateScores', scores);
// 			}
// 		}
// 	});

// 	// Escuchar evento de reinicio
// 	socket.on('restartGame', () => {
// 		scores = {}; // Reiniciar puntuaciones
// 		winner = null;
// 		io.emit('restartGame');
// 	});

// 	// Evento de desconexión
// 	socket.on('disconnect', () => {
// 		console.log('Cliente desconectado');
// 	});
// });

// // Configuración de archivos estáticos si aún no está configurado
// // app.use(express.static(path.join(__dirname, 'public')));

// // Ruta para /results/screen1
// app.get('/results/screen1', (req, res) => {
// 	res.sendFile(path.join(__dirname, 'public', 'screen1.html'));
// });

// // const { createServer } = require("http");

// // const app = require("./app.js");
// // const { initSocket } = require("./socket.js");

// // const httpServer = createServer(app) // Explicity creates an HTTP server from the Express app

// server.listen(5050, () => {
// 	console.log('server starting 🚀🆙✔ on http://localhost:5050');
// });
