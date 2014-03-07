$(document).ready(function() {
	start();
});

function start() {
	var socket = io.connect('http://localhost:3001');

	socket.on('connect', function() {
		console.log('connected');
	});

	setInterval(function() {
		socket.emit('heart');
	}, 1000 / 30);
}
