var NavItemLink = Marionette.ItemView.extend({
    template: '#navigation-link',
    tagName: 'li',
    events: {
        'click a': 'navigate'
    },

    navigate: function (e) {
        e.preventDefault();
        this.trigger('navigate', this.model);
    },

    onRender:function(){
        if(this.model.selected){
            // add this class so bootstrap will highlight the selected menu item
            this.$el.addClass("active");
        }
    }
});

var NavItemLinks = Marionette.CompositeView.extend({
    template: '#navigation-template',
    childView: NavItemLink,
    childViewContainer: 'ul',

    events:{
        'click a.brand': 'brandClicked'
    },

    brandClicked: function (e) {
        e.preventDefault();
        this.trigger('brand:clicked');
    }
});

var NavigationController = {
    navHandler: function () {
        var navLinks = new NavItemLinks();
        navLinks.on('brand:clicked', function () {
            console.log('go to index page');
        });

        navLinks.on('childview:navigate', function(childView, model){
            console.log('go to' + childView);
        });
        Time2BrewApp.regions.menu.show(new NavView());
    }

};