var StatusRouter = Backbone.Router.extend({
    initialize: function(options){
        this.container = options.container;
    },
    routes: {
        'status': 'index',//#status
        '*other': 'defaultRoute'
    },

    index: function () {
        console.log('showing the status view');
        var view = new StatusView();
        this.container.show(view);
    },
    defaultRoute: function (other) {
        $(document.body).append('Invalid. You attempted to reach: ' + other);
    }
});
