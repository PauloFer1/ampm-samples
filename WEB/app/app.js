// Set up namespaces, create root model and view.
APP = _.extend({

    Views: {},

    Models: {},

    initialize: function() {
        this.model = new APP.Model();
        this.view = new APP.View({
            el: document.body,
            model: this.model
        });
    }
});
