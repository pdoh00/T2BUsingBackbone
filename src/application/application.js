
Time2BrewApp = new Marionette.Application();

//override the renderer to use Mustache templates instead of underscore
Backbone.Marionette.Renderer.render = function(template, data){
    var html = $(template).html();
    return Mustache.render(html, data);
};

Time2BrewApp.getCurrentRoute = function(){
    return Backbone.history.fragment;
};

Time2BrewApp.on('before:start', function(){
    Time2BrewApp.baseAPIAddress = 'http://ahardinger.ddns.net:24579/api/';

    Time2BrewApp.layout = new AppLayoutView();
    Time2BrewApp.layout.render();
    Time2BrewApp.layout.menu.show(new NavView());
    Time2BrewApp.layout.footer.show(new FooterView());

});

Time2BrewApp.on('start', function(){
   console.log('starting the Time2BrewApp');

    Time2BrewApp.index = new IndexRouter({container: Time2BrewApp.layout.content  });

    //Time2BrewApp.status = new StatusRouter({container: Time2BrewApp.layout.content  });

    if (Backbone.history) {
        Backbone.history.start();
    }

    if(this.getCurrentRoute() === ''){
        Time2BrewApp.trigger("");
    }


});
