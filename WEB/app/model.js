// Root model, contains all application state.
APP.Model = Backbone.Model.extend({
    defaults: {
        someModel: null
    },

    initialize: function() {
        this.set('someModel', new APP.Models.SomeModel());
        setInterval(function() {
            ampm.heart();
        }, 1000 / 30);
    }
});
