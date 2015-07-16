var TemperatureProfileStepModel = Backbone.Model.extend({
    defaults: {
        startTemp: '',
        endTemp: '',
        duration: '',
        stepText: ''
    },
    initialize: function () {
        this.bind('change', this.buildStepText(), this);
    },
    buildStepText: function () {
        var startTemp = this.get('startTemp');
        var endTemp = this.get('endTemp');
        var duration = this.get('duration');
        var text = '';
        if (startTemp == endTemp) {
            text = "Hold at: " + startTemp + ' \xB0F' + " for " + utils.formatTime(duration);
        }
        else {
            text = "Ramp from " + startTemp + ' \xB0F' + " to " + endTemp + ' \xB0F' + " over "
                + utils.formatTime(duration);
        }
        return text;
    }
});

var TemperatureProfileStepsCollection = Backbone.Collection.extend({
    model: TemperatureProfileStepModel,
});


var StepView = Marionette.ItemView.extend({
    //template: '#step-template',
    tagName: 'li',
    model: TemperatureProfileStepModel,
    initialize: function () {
        var _thisView = this;
        this.listenTo(this.model, 'change', this.render);
        this.listenTo(this.model, 'change:startTemp', this.startTempChanged);
        _thisView.htmlTemplate = $('#step-template').html();
        Mustache.parse(_thisView.htmlTemplate);
    },
    startTempChanged: function () {
        console.log('StepView sensed that the model startTemp changed' + this.model.startTemp);
    }
});

var StepCollectionView = Backbone.Marionette.CollectionView.extend({

    className: 'stepCollection',
    childView: StepView
});