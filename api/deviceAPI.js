//constructor
var DeviceAPI = function (baseAPIAddress) {
    this.baseAPIAddress = baseAPIAddress;
};

DeviceAPI.prototype.setCredentials = function () {
    var url = this.baseAPIAddress + 'updatecredentials?username=' + username + '&password=' + password;
    return Rx.Observable.fromPromise(promiseAPI.put(url));
};

DeviceAPI.prototype.setTime = function (time) {
    var totalSecondsFromEpoch = Math.round(time.getTime() / 1000);
    var url = this.baseAPIAddress + '/api/time?time=' + totalSecondsFromEpoch;
    return Rx.Observable.fromPromise(promiseAPI.put(url));
};

DeviceAPI.prototype.trimFileSystem = function () {
    var url = this.baseAPIAddress + 'trimfilesystem';
    return Rx.Observable.fromPromise(promiseAPI.put(url));
};

DeviceAPI.prototype.updateFirmware = function () {

};

DeviceAPI.prototype.getFirmwareVersion = function () {
    var url = this.baseAPIAddress + 'version';
    return Rx.Observable.fromPromise(
        promiseAPI.get(url, 'text').then(function(response) {
            return response;
        }));
};

DeviceAPI.prototype.reboot = function () {
    var url = this.baseAPIAddress + 'restart?confirm=restart';
    return Rx.Observable.fromPromise(promiseAPI.put(url));
};

DeviceAPI.prototype.resetToFactoryDefault = function () {
    var url = this.baseAPIAddress + 'format?confirm=format';
    return Rx.Observable.fromPromise(promiseAPI.put(url));
};