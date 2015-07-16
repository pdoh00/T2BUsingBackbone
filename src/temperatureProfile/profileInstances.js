var TemperatureProfileInstanceModel = Backbone.Model.extend({
    defaults: {
        timeStamp: '' //Date
    },
});

var TemperatureProfileInstanceCollection = Backbone.Collection.extend({
    model: TemperatureProfileInstanceModel,
});
