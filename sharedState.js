var path = require('path'); //http://nodejs.org/api/path.html
var fs = require('fs'); // http://nodejs.org/api/fs.html

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
	}
});
