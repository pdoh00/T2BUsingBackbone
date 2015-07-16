var StatusModel = Backbone.Model.extend({

    initialize: function(options){
      this.statusAPI = options.statusAPI;
    },
    defaults: {
        systemTime: 'default',
        systemMode: '',
        regulationMode: '',
        probe0Assignment: '',
        probe1Assignment: '',
        probe0Temperature: '',
        probe1Temperature: '',
        heatRelayOn: '',
        coolRelayOn: '',
        activeProfile: '',
        currentStepIndex: '',
        currentStepTemperature: '',
        currentStepRemainingSeconds: '',
        manualSetpointTemperature: '',
        profileStartTime: '',
        equipmentProfile: ''
    },

    sync: function (method, model, options) {
        //var type = methodMap[method];

        // Default options, unless specified.
        _.defaults(options || (options = {}), {
            emulateHTTP: Backbone.emulateHTTP,
            emulateJSON: Backbone.emulateJSON
        });

        // Default JSON-request options.
        //var params = {type: type, dataType: 'json'};

        // Ensure that we have a URL.
        //if (!options.url) {
        //    params.url = _.result(model, 'url') || urlError();
        //}

        // Ensure that we have the appropriate request data.
        //if (options.data == null && model && (method === 'create' || method === 'update' || method === 'patch')) {
        //    params.contentType = 'application/json';
        //    params.data = JSON.stringify(options.attrs || model.toJSON(options));
        //}

        // For older servers, emulate JSON by encoding the request into an HTML-form.
        //if (options.emulateJSON) {
        //    params.contentType = 'application/x-www-form-urlencoded';
        //    params.data = params.data ? {model: params.data} : {};
        //}

        // For older servers, emulate HTTP by mimicking the HTTP method with `_method`
        // And an `X-HTTP-Method-Override` header.
        //if (options.emulateHTTP && (type === 'PUT' || type === 'DELETE' || type === 'PATCH')) {
        //    params.type = 'POST';
        //    if (options.emulateJSON) params.data._method = type;
        //    var beforeSend = options.beforeSend;
        //    options.beforeSend = function(xhr) {
        //        xhr.setRequestHeader('X-HTTP-Method-Override', type);
        //        if (beforeSend) return beforeSend.apply(this, arguments);
        //    };
        //}

        // Don't process data on a non-GET request.
        //if (params.type !== 'GET' && !options.emulateJSON) {
        //    params.processData = false;
        //}

        // Pass along `textStatus` and `errorThrown` from jQuery.
        //var error = options.error;
        //options.error = function(xhr, textStatus, errorThrown) {
        //    options.textStatus = textStatus;
        //    options.errorThrown = errorThrown;
        //    if (error) error.call(options.context, xhr, textStatus, errorThrown);
        //};

        return this.statusAPI.getStatus()
            .subscribe(function(response) {
                options.success(response);
            },function(err){
                //rejection
                console.error(err);
            });

    },

    parse: function (response) {
        return response;
    }


});

