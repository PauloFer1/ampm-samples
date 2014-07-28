// Root view, contains all subviews.
APP.View = Backbone.View.extend({
	events: {
		'click #crash': '_onCrashClicked',
		'click #hang': '_onHangClicked',
		'click #log': '_onLogClicked',
		'click #event': '_onEventClicked',
		'click #console': '_onConsoleClicked'
	},

	_subView: null,

	initialize: function() {

		// Initializing a sub view with a model.
		this._subView = new APP.Views.SomeView({
			el: this.$el,
			model: this.model.get('someModel')
		});

		// You'll get the config that was passed to ampm as an event as soon as you connect.
		ampm.socket().on('config', function(data) {
			$('#config', this.$el).html(JSON.stringify(data, null, '\t'));
		});
	},

	_onCrashClicked: function() {
		// Crashes will cause heartbeats to stop being sent and your app will get restarted.
		var bar = foo.bar;
	},

	_onHangClicked: function() {
		// Hangs will cause heartbeats to stop being sent and your app will get restarted.
		while (true) {}
	},

	_onLogClicked: function() {
		// Example of how to send log messages.
		ampm.info('informational!');
		ampm.warning('warning!');
		ampm.error('error!');
	},

	_onEventClicked: function() {
		// Example of how to track events.
		ampm.logEvent('app event', 'clicked', 'button', 2);
	},

	_onConsoleClicked: function() {
		window.open('http://localhost:81');
	}
});
