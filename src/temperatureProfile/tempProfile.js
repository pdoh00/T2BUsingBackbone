var TemperatureProfileModel = Backbone.Model.extend({
    defaults: {
        id: '',
        name: '',
        steps: TemperatureProfileStepModel
    }
});

var TemperatureProfileCollection = Backbone.Collection.extend({
    model: TemperatureProfileModel
});

var TemperatureProfileView = Marionette.CompositeView.extend({
    template: '#profileTemplate',
    className: 'row',
    model: TemperatureProfileModel,
    //collection: TemperatureProfileStepsCollection,
    childView: StepCollectionView,
    childViewContainer: 'ol',

    initialize: function () {
        var _thisView = this;
        this.listenTo(this.model, 'change', this.render);
        this.collection = new TemperatureProfileStepsCollection(this.model.get('steps'));

        _thisView.htmlTemplate = $('#profileTemplate').html();
        Mustache.parse(_thisView.htmlTemplate);
    }
});

var TemperatureProfileListItem = Backbone.Marionette.ItemView.extend({
    template: '#temp-profile-list-group-item',
    className: 'list-group-item',
    model: TemperatureProfileModel,
    initialize: function () {
       this.htmlTemplate = $('#temp-profile-list-group-item').html();
       Mustache.parse(this.htmlTemplate);
   }
});

var TemperatureProfileListView = Backbone.Marionette.CollectionView.extend({
    //template: '#temp-profile-list-group',
    //tagName: 'profileListContainer',
    className: 'list-group',
    childView: TemperatureProfileListItem,

    initialize: function () {
        console.log('Creating a TemperatureProfileListView');
    }
});

var TemperatureProfilePageView = Backbone.Marionette.LayoutView.extend({
    //el: '#main-content',
    id: 'profilePage',
    className: 'container flex-container-row',
    template: '#tempProfilePage-layout-template',
    regions: {
        menu: '#profileListContainer',
        content: '#profileDetails'
    }
});