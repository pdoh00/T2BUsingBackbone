var StatusView = Marionette.ItemView.extend({
    template: '#status-template',
    className: 'status',
    initialize: function () {
        var _thisView = this;
        this.listenTo(this.model, 'change', this.render);

        _thisView.htmlTemplate = $('#status-template').html();
        Mustache.parse(_thisView.htmlTemplate);

        var timerTick = Rx.Observable.timer(0, 1000);
        _thisView.timer = timerTick.subscribe(function () {
            _thisView.model.fetch();
        });
    },
    destroy: function () {
        var _thisView = this;
        this.stopListening();
        _thisView.timer.dispose();
    }
});