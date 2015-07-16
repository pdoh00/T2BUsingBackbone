var IndexRouter = Backbone.Router.extend({
    initialize: function (options) {
        this.container = options.container;
    },
    routes: {
        "": "index", //#index,
        'status': 'status',//#status
        'temperatureProfiles': 'tempProfiles', //#tempProfiles
        'equipmentProfiles': 'equipmentProfiles', //#equipmentProfiles
        'device': 'device', //#device,
        '*other': 'defaultRoute'
    },

    index: function () {
        var indexView = new IndexView();
        this.container.show(indexView);
        //var appView = new src.views.AppView({});
        //src.windowMgr.showView(appView);
    },
    status: function () {
        var statusAPI = new StatusAPI(Time2BrewApp.baseAPIAddress);
        var model = new StatusModel({statusAPI: statusAPI});
        var view = new StatusView({model: model});
        this.container.show(view);
    },
    tempProfiles: function () {
        console.log('showing the temp profile view');
        var _container = this.container;
        var tempProfileAPI = new TemperatureProfileAPI(Time2BrewApp.baseAPIAddress);

        tempProfileAPI.getProfiles()
            .subscribe(function (tempProfiles) {

                var profileCollection = new TemperatureProfileCollection(tempProfiles);
                var pageView = new TemperatureProfilePageView();
                _container.show(pageView);

                pageView.menu.show(new TemperatureProfileListView({collection: profileCollection}));

//TODO: show the correct page view in the content region on list selection.
//                var view = new TemperatureProfilePageView({collection: profileCollection});

                //var view = new TemperatureProfileView({collection: profileCollection});

            }, function (err) {
                //rejection
                console.error(err);
            });


    },
    equipmentProfiles: function () {
        console.log('showing the equip view');
        var equipProfileAPI = new EquipmentProfileAPI(Time2BrewApp.baseAPIAddress);
        var equipProfileCollection = new EquipmentProfileCollection({equipmentProfileAPI: equipProfileAPI});
        var view = new EquipmentProfileView({collection: equipProfileCollection});
        this.container.show(view);
    },
    device: function () {
        console.log('showing the device view');
        var view = new DeviceView();
        this.container.show(view);
    },
    defaultRoute: function (other) {
        $(document.body).append('Invalid. You attempted to reach: ' + other);
    }
});