//constructor
var StatusAPI = function (baseAPIAddress) {
    this.baseAPIAddress = baseAPIAddress;
};

//method
StatusAPI.prototype.getStatus = function () {
    return Rx.Observable.fromPromise(
        promiseAPI.get(this.baseAPIAddress + 'status', 'arraybuffer')
            .then(function (data) {
                var status = {};
                var dv = new DataView(data);
                var aryOffset = 0;

                status.systemTime = new Date(dv.getUint32(aryOffset, true) * 1000);
                aryOffset += 4;

                status.systemMode = dv.getInt8(aryOffset);
                aryOffset += 1;

                status.regulationMode = dv.getInt8(aryOffset);
                aryOffset += 1;

                status.probe0Assignment = dv.getInt8(aryOffset);
                aryOffset += 1;

                status.probe0Temperature = Math.round(utils.celsiusToFahrenheit(dv.getFloat32(aryOffset, true)) * 100) / 100 + ' \xB0F';
                aryOffset += 4;

                status.probe1Assignment = dv.getInt8(aryOffset);
                aryOffset += 1;

                status.probe1Temperature = Math.round(utils.celsiusToFahrenheit(dv.getFloat32(aryOffset, true)) * 100) / 100 + ' \xB0F';
                aryOffset += 4;

                status.heatRelayOn = dv.getInt8(aryOffset) === 0 ? 'Off' : 'On';
                aryOffset += 1;

                status.coolRelayOn = dv.getInt8(aryOffset) === 0 ? 'Off' : 'On';
                aryOffset += 1;

                status.activeProfile = utils.readUTF8String(data, aryOffset, 64);
                aryOffset += 64;

                status.currentStepIndex = dv.getInt16(aryOffset, true);
                aryOffset += 2;

                status.currentStepTemperature = Math.round(utils.celsiusToFahrenheit(dv.getFloat32(aryOffset, true)) * 100) / 100 + ' \xB0F';
                aryOffset += 4;

                status.currentStepRemainingSeconds = utils.formatTime(dv.getUint32(aryOffset, true));
                aryOffset += 4;

                status.manualSetPointTemperature = Math.round(utils.celsiusToFahrenheit(dv.getFloat32(aryOffset, true)) * 100) / 100 + ' \xB0F';
                aryOffset += 4;

                status.profileStartTime = new Date(dv.getUint32(aryOffset, true) * 1000);
                aryOffset += 4;

                status.equipmentProfileName = utils.readUTF8String(data, aryOffset, 64);
                //aryOffset += 64;

                return status;
            }));
};
