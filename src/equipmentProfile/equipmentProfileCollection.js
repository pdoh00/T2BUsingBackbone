var EquipmentProfileCollection = Backbone.Collection.extend({
    model: EquipmentProfileModel,
    initialize: function(options){
        this.equipmentProfileAPI = options.equipmentProfileAPI
    },

    sync: function (method, model, options) {

        // Default options, unless specified.
        _.defaults(options || (options = {}), {
            emulateHTTP: Backbone.emulateHTTP,
            emulateJSON: Backbone.emulateJSON
        });

        return this.tempProfileAPI.getProfiles()
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