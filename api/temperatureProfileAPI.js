//constructor
var TemperatureProfileAPI = function (baseAPIAddress) {
    this.baseAPIAddress = baseAPIAddress;
};

//method
TemperatureProfileAPI.prototype.getProfiles = function () {
    var apiAddress = this.baseAPIAddress;
    return Rx.Observable.fromPromise(
        promiseAPI.get(this.baseAPIAddress + 'profile', 'text')
            .then(function (response) {

                //CR/LF is delimeter
                return response.split("\r\n")
                    .filter(function (arg) {
                        return arg !== "";
                    }).map(function (profileName) {
                        var segmented = profileName.split(",");
                        return {
                            id: segmented[0],
                            name: segmented[1]
                        };
                    });

            })
    ).
        selectMany(function (x, i) {
            return TemperatureProfileAPI.getProfileSteps(apiAddress, x[i]['id']);
        }, function (x,y, xi) {
            x[xi]['steps'] = y;
            return x;
        });
};

TemperatureProfileAPI.prototype.getInstanceSteps = function (profileId, instanceId) {
    var url = this.baseAPIAddress + 'instancesteps?id=' + profileId +
        '&instance=' + instanceId;

    return Rx.Observable.fromPromise(
        promiseAPI.get(url, 'arraybuffer')
            .then(function (response) {
                return parseProfileInstanceSteps(response);
            }));
};

TemperatureProfileAPI.getProfileSteps = function (baseAPIAddress, profileId) {
    var url = baseAPIAddress + 'profile?id=' + profileId;

    return Rx.Observable.fromPromise(
        promiseAPI.get(url, 'arraybuffer')
            .then(function (response) {
                return parseProfileSteps(response);
            }));
};

TemperatureProfileAPI.getProfileRuns = function (baseAPIAddress, profileId) {

    var url = baseAPIAddress + 'instancesteps?id=' + profileId;
    //return Rx.Observable.fromPromise(
    return promiseAPI.get(url, 'text')
        .then(function (response) {
            //CR/LF is delimeter
            //seconds from epoch in hex

            var instances = response.split("\r\n")
                .filter(function (arg) {
                    return arg !== "";
                }).map(function (secondsFromEpoch) {
                    return new Date(secondsFromEpoch * 1000);
                });

            return instances;
        });

};

TemperatureProfileAPI.prototype.createProfile = function (profileName, steps) {
    var fileOffset = 0;

    var bufferSize = 12 * steps.length; //12 bytes per step
    var contentBuffer = new ArrayBuffer(bufferSize);
    var dv = new DataView(contentBuffer);

    for (var i = 0; i < steps.length; i++) {
        var offset = 12 * i;
        dv.setFloat32(offset, steps[i].startTemp, true);
        dv.setFloat32(offset + 2, steps[i].endTemp, true);
        dv.setInt32(offset + 4, steps[i].duration, true);
    }

    //now read 512 bytes at a time and send them.
    var base64String = btoa(String.fromCharCode.apply(null, new Uint8Array(contentBuffer)));
    var chksum = utils.fletcherChecksum(sendData, 0, length);

    var url = this.baseAPIAddress + '/api/profile?name=' + profileName + '&offset=' +
        fileOffset + '&chksum=' + chksum + '&content=' + base64String;

    return Rx.Observable.fromPromise(promiseAPI.put(url));
};

TemperatureProfileAPI.prototype.deleteProfile = function (profileId) {
    var url = this.baseAPIAddress + 'deleteprofile?id=' + profileId;
    return Rx.Observable.fromPromise(promiseAPI.put(url));
};

TemperatureProfileAPI.prototype.terminateRunningProfile = function () {
    var url = this.baseAPIAddress + 'terminateprofile';
    return Rx.Observable.fromPromise(promiseAPI.put(url));
};

TemperatureProfileAPI.prototype.truncateRunningProfile = function () {

};

TemperatureProfileAPI.prototype.startProfile = function (profileId) {
    var url = this.baseAPIAddress + 'executeprofile?id=' + profileId;
    return Rx.Observable.fromPromise(promiseAPI.put(url));
};


TemperatureProfileAPI.prototype.deleteProfileRunData = function (profileId, profileInstanceDate) {
    var url = this.baseAPIAddress + 'deleteinstance?id=' + profileID + '&instance=' + profileInstanceDate;
    return Rx.Observable.fromPromise(promiseAPI.put(url));
};

TemperatureProfileAPI.prototype.getTrendData = function (profileId, profileInstanceDate) {
    var url = this.baseAPIAddress + 'instancetrend?id=' +
        profileId + '&instance=' + profileInstanceDate + '&reloadCacheHack=' + new Date().getTime();

    return Rx.Observable.fromPromise(
        promiseAPI.get(url, 'arraybuffer').then(function (response) {
            var trendData = parseTrendData(response);
            return trendData;
        }));
}

/*
 Parses a binary response into an array of step objects
 step: {startTemp, endTemp, duration}
 startTemp: degrees F
 endTemp: degrees F
 duration: seconds
 */
function parseProfileSteps(response) {
    var steps = [];

    var dv = new DataView(response);
    var aryOffset = 64;

    for (var i = 0; i < (response.byteLength - 64) / 12; i++) {
        var step = {};

        var startInCelsius = dv.getFloat32(aryOffset, true);
        step.startTemp = Math.round(utils.celsiusToFahrenheit(startInCelsius) * 100) / 100;
        aryOffset += 4;

        var endInCelsius = dv.getFloat32(aryOffset, true);
        step.endTemp = Math.round(utils.celsiusToFahrenheit(endInCelsius) * 100) / 100;
        aryOffset += 4;

        step.duration = dv.getInt32(aryOffset, true);
        aryOffset += 4;

        steps.push(step);
    }
    return steps;
}

/*
 Parses a binary response into an array of step objects

 step: {startTemp, endTemp, duration}

 startTemp: degrees F
 endTemp: degrees F
 duration: seconds
 */
function parseProfileInstanceSteps(response) {
    var steps = [];

    var dv = new DataView(response);
    var aryOffset = 0;

    var blen = response.byteLength;

    for (var i = 0; i < response.byteLength / 12; i++) {
        var step = {};

        var startInCelsius = dv.getFloat32(aryOffset, true);
        step.startTemp = Math.round(utils.celsiusToFahrenheit(startInCelsius) * 100) / 100;
        aryOffset += 4;

        var endInCelsius = dv.getFloat32(aryOffset, true);
        step.endTemp = Math.round(utils.celsiusToFahrenheit(endInCelsius) * 100) / 100;
        aryOffset += 4;

        step.duration = dv.getInt32(aryOffset, true);
        aryOffset += 4;

        steps.push(step);
    }
    return steps;
}

/*
 Parses a binary response into an array of trendData objects

 trendData: {probe0Temp, probe1Temp, setpointTemp, outputPercent}

 probe0Temp: degrees F
 probe1Temp: degrees F
 setpointTemp: degrees F
 outputPercent: percent
 */
function parseTrendData(response) {
    var dv = new DataView(response);
    var aryOffset = 0;
    var sampleIdx = 0;

    var trendData = [];

    var probe0Temp_C;
    var probe1Temp_C;
    var Packed;

    for (var i = 0; i < response.byteLength / 7; i++) {
        var record = {};
        Packed = dv.getUint32(aryOffset, true);
        aryOffset += 4;


        if (Packed != 0xFFFFFFFF) {
            var RelayStatus = Packed & 3;
            Packed >>= 2;
            var OutputPercent = Packed & 1023;
            Packed >>= 10;
            var p1_temp = Packed & 1023;
            Packed >>= 10;
            var p0_temp = Packed & 1023;

            probe0Temp_C = (p0_temp * 0.146628) - 25;
            probe1Temp_C = (p1_temp * 0.146628) - 25;
            OutputPercent -= 100;

            record.probe0Temp = Math.round(utils.celsiusToFahrenheit(probe0Temp_C) * 100) / 100;
            record.probe1Temp = Math.round(utils.celsiusToFahrenheit(probe1Temp_C) * 100) / 100;
            record.outputPercent = OutputPercent;
            record.RelayStatus = RelayStatus;
        } else {
            record.probe0Temp = 0;
            record.probe1Temp = 0;
            record.outputPercent = 0;
            record.RelayStatus = 0;
        }
        sampleIdx += 1;
        record.SampleIdx = sampleIdx;
        trendData.push(record);
    }
    return trendData;
}