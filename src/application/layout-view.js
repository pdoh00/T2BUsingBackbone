
var AppLayoutView = Marionette.LayoutView.extend({
    el: '#application',
    template: '#layout-view-template',
    regions: {
        menu: '#nav',
        content: '#main-content',
        footer: 'footer'
    }

});