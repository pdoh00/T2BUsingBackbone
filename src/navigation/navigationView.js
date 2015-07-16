var NavView = Backbone.Marionette.ItemView.extend({
    template: '#navigation-template',
    tagName: 'nav',
    className: 'header navbar navbar-inverse navbar-fixed-top',

    attributes: {
        role: 'navigation'
    },
    collectionEvents: {
        all: 'render'
    },
    ui: {
        collapse: '#navbar-collapse'
    },

    events: {
        'show.bs.collapse #navbar-collapse': 'onCollapseShow'
    },

    onCollapseShow: function () {
        this.listenToOnce(history, 'route', function () {
            this.ui.collapse.collapse('hide');
        });
    }
});
