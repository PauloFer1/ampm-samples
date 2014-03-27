// Interface for sending things to ampm.
var ampm = Backbone.Model.extend({}, {

	// Set to true after any JS error.
	crashed: false,

	// Return a reference to the ampm socket connection.
	socket: function() {
		if (ampm._socket) {
			return ampm._socket;
		}

		ampm._socket = io.connect('http://localhost:3001');
		ampm._socket.on('connect', function() {
			console.log('ampm socket connected');
		});

		return ampm._socket;
	},

	// Send a heartbeat message.
	heart: function() {
		if (ampm.crashed) {
			return;
		}

		ampm.socket().emit('heart');
	},

	// Log a user event.
	logEvent: function(category, action, label, value) {
		ampm.socket().emit('event', {
			Category: category,
			Action: action,
			Label: label,
			Value: value
		});
	},

	// Send a log message.
	logMessage: function(eventLevel, message) {
		ampm.socket().emit('log', {
			level: eventLevel,
			message: message
		});
	},

	// Send a log message at the error level.
	error: function(message) {
		ampm.logMessage('Error', message);
	},

	// Send a log message at the warning level.
	warning: function(message) {
		ampm.logMessage('Warning', message);
	},

	// Send a log message at the info level.
	info: function(message) {
		ampm.logMessage('Informational', message);
	}
});

// Catch all errors and stop sending heartbeats so we get restarted.
window.onerror = function(message, url, lineNumber) {
	ampm.crashed = true;
	ampm.error('Error on line ' + lineNumber + ' ' + message);
	return false;
};
