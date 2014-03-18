var path = require('path'); //http://nodejs.org/api/path.html
var fs = require('fs'); // http://nodejs.org/api/fs.html
var os = require('os'); // http://nodejs.org/api/os.html

// Figure out where the modules are.
var devModules = '../ampm/node_modules';
var liveModules = 'ampm/node_modules';
var node_modules = '';
if (fs.existsSync(devModules)) {
	node_modules = devModules;
} else if (fs.existsSync(liveModules)) {
	node_modules = liveModules;
}

var _ = require(path.join(node_modules, 'lodash')); // Utilities. http://underscorejs.org/
var Backbone = require(path.join(node_modules, 'backbone')); // Data model utilities. http://backbonejs.org/

exports.SharedState = Backbone.Model.extend({
	defaults: {
		x: 0,
		y: 0
	},

	// This is the object that will be sent to other peers.
	shared: null,

	initialize: function() {

		// By default just send the model's attributes, but you could create
		// another object and sync it if you don't want to send everything.
		this.shared = this.attributes;

		// Listen for TCP events from the app.
		$$network.transports.socketToApp.sockets.on('connection', _.bind(function(socket) {
			socket.on('mouse', _.bind(function(data) {
				this.set('x', data.x);
				this.set('y', data.y);
			}, this));
		}, this));

		// Listen for UDP events from the app.
		$$network.transports.oscFromApp.on('heart', _.bind(function(data) {
			// console.log(data);
		}, this));
	}
});
