//constructor
var EquipmentProfileAPI = function (baseAPIAddress) {
    this.baseAPIAddress = baseAPIAddress;
};

EquipmentProfileAPI.prototype.getProfiles = function () {
    var url = this.baseAPIAddress + 'equipmentprofile';
    return Rx.Observable.fromPromise(
        promiseAPI.get(url, 'text').then(function(response) {
            var equipmentProfileNames = response.split("\r\n")
                .filter(function(arg) {
                    return arg !== "";
                });
            return equipmentProfileNames;
        }));
};

EquipmentProfileAPI.prototype.getProfile = function (name) {
    var url = this.baseAPIAddress + 'equipmentprofile?name=' + name;
    return Rx.Observable.fromPromise(
        promiseAPI.get(url, 'arraybuffer').then(function(response) {
            return parseEquipmentProfile(response);
        }));
};

EquipmentProfileAPI.prototype.deleteProfile = function (name) {
    var url = this.baseAPIAddress + 'deleteequipmentprofile?name=' + name;
    return Rx.Observable.fromPromise(promiseAPI.put(url));
};

var parseEquipmentProfile = function(response) {
    var dv = new DataView(response);
    var aryOffset = 0;

    var calcF16 = utils.fletcherChecksum(response, 0, response.byteLength - 2);

    var equipmentProfile = {};

    equipmentProfile.regulationMode = dv.getInt8(aryOffset);
    aryOffset += 1;

    equipmentProfile.probe0Assignment = dv.getInt8(aryOffset);
    aryOffset += 1;

    equipmentProfile.probe1Assignment = dv.getInt8(aryOffset);
    aryOffset += 1;
    aryOffset += 1; //dummy byte

    equipmentProfile.heatMinTimeOn = dv.getUint32(aryOffset, true);
    aryOffset += 4;

    equipmentProfile.heatMinTimeOff = dv.getUint32(aryOffset, true);
    aryOffset += 4;

    equipmentProfile.coolMinTimeOn = dv.getUint32(aryOffset, true);
    aryOffset += 4;

    equipmentProfile.coolMinTimeOff = dv.getUint32(aryOffset, true);
    aryOffset += 4;

    equipmentProfile.processKp = dv.getUint32(aryOffset, true);
    aryOffset += 4;

    equipmentProfile.processKi = dv.getUint32(aryOffset, true);
    aryOffset += 4;

    equipmentProfile.processKd = dv.getUint32(aryOffset, true);
    aryOffset += 4;

    equipmentProfile.targetKp = dv.getUint32(aryOffset, true);
    aryOffset += 4;

    equipmentProfile.targetKi = dv.getUint32(aryOffset, true);
    aryOffset += 4;

    equipmentProfile.targetKd = dv.getUint32(aryOffset, true);
    aryOffset += 4;

    equipmentProfile.targetOutputMaxC = dv.getUint32(aryOffset, true);
    aryOffset += 4;

    equipmentProfile.targetOutputMinC = dv.getUint32(aryOffset, true);
    aryOffset += 4;

    equipmentProfile.thresholdDeltaC = dv.getUint32(aryOffset, true);
    aryOffset += 4;

    var recordF16 = dv.getUint16(aryOffset, true);
    aryOffset += 2;

    if (calcF16 !== recordF16) {
        console.warning("Checksums to do not match Calculated=" + calcF16 + " Record=" + recordF16 + "sourceData");
    }

    return equipmentProfile;
};