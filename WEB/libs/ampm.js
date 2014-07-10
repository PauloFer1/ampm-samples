/**
 * Protect window.console method calls, e.g. console is not defined on IE
 * unless dev tools are open, and IE doesn't define console.debug
 * http://stackoverflow.com/a/13817235/468472
 */
if (!window.console) {
	window.console = {};
}
// union of Chrome, FF, IE, and Safari console methods
var m = [
	"log", "info", "warn", "error", "debug", "trace", "dir", "group",
	"groupCollapsed", "groupEnd", "time", "timeEnd", "profile", "profileEnd",
	"dirxml", "assert", "count", "markTimeline", "timeStamp", "clear"
];
// define undefined methods as noops to prevent errors
for (var i = 0; i < m.length; i++) {
	if (!window.console[m[i]]) {
		window.console[m[i]] = function() {};
	}
}

// Interface for sending things to ampm.
var ampm = Backbone.Model.extend({}, {


	// Any error messages in this array will not crash the app.
	ignoreErrors: [],

	_logMethods: {
		log: console.log,
		warn: console.warn,
		error: console.error,
		info: console.info,
		debug: console.debug,
		trace: console.trace
	},

	// Set to true after any JS error.
	crashed: false,

	// Return a reference to the ampm socket connection.
	socket: function() {
		if (ampm._socket) {
			return ampm._socket;
		}

		if (document.location.host != 'localhost') {
			ampm._socket = {
				emit: function() {},
				on: function() {}
			};
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
window.onerror = function(errorMsg, url, lineNumber, column, errorObj) {
	if (ampm.ignoreErrors.indexOf(errorMsg) != -1) {
		return false;
	}

	ampm.crashed = true;
	ampm.error('Error: ' + errorMsg + '\nScript: ' + url + '\nLine: ' + lineNumber + '\nColumn: ' + column + '\nStack: ' + errorObj.stack);
	return false;
};

console.log = function() {
	ampm.info(Array.prototype.slice.call(arguments, 0).join(', '));
	ampm._logMethods.log.apply(console, arguments);
};

console.info = function() {
	ampm.info(Array.prototype.slice.call(arguments, 0).join(', '));
	ampm._logMethods.info.apply(console, arguments);
};

console.debug = function() {
	ampm.info(Array.prototype.slice.call(arguments, 0).join(', '));
	ampm._logMethods.debug.apply(console, arguments);
};

console.trace = function() {
	ampm.info(Array.prototype.slice.call(arguments, 0).join(', '));
	ampm._logMethods.trace.apply(console, arguments);
};

console.warn = function() {
	ampm.warning(Array.prototype.slice.call(arguments, 0).join(', '));
	ampm._logMethods.warn.apply(console, arguments);
};

console.error = function() {
	ampm.error(Array.prototype.slice.call(arguments, 0).join(', '));
	ampm._logMethods.error.apply(console, arguments);
};
