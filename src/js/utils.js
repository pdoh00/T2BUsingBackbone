var utils = (function () {

    var celsiusToFahrenheit = function (degreesC) {
        return degreesC * (9 / 5) + 32.0;
    };

    var fahrenheitToCelsius = function (degreesF) {
        return (degreesF - 32.0) * (5 / 9);
    };

    var formatTime = function (seconds) {
        var days = 0;
        var hours = 0;
        var remainingSeconds = seconds;
        var returnString = "";

        if (remainingSeconds >= 86400) {
            returnString += Math.floor(remainingSeconds / 86400) + " days ";
            remainingSeconds = remainingSeconds % 86400;
        }
        if (remainingSeconds >= 3600) {
            returnString += Math.floor(remainingSeconds / 3600) + " hours ";
            remainingSeconds = remainingSeconds % 3600;
        }
        if (remainingSeconds >= 60) {
            returnString += Math.floor(remainingSeconds / 60) + " min ";
            remainingSeconds = remainingSeconds % 60;
        }
        if (remainingSeconds > 0) {
            returnString += remainingSeconds + " sec";
        }

        return returnString;
    };

    var readUTF8String = function (responseData, offset, length) {
        var dataAry = new Int8Array(responseData, offset, length);
        var retString = "";
        for (var j = 0; j < dataAry.length; j++) {
            if (dataAry[j] === 0) {
                break;
            } else {
                retString += String.fromCharCode(dataAry[j]);
            }
        }
        return retString;
    };

    var fletcherChecksum = function (data, offset, count) {
        var sum1 = 0xFF;
        var sum2 = 0xFF;
        var index = offset;

        while (count) {
            var tlen = Math.min(20, count);
            count -= tlen;
            while (tlen) {
                sum1 += data[index];
                sum2 += sum1;
                index += 1;
                tlen += 1;
            }
        }

        sum1 = (sum1 & 0xFF) + (sum1 >> 8);
        sum2 = (sum1 & 0xFF) + (sum2 >> 8);

        return (sum2 << 8) | sum1;
    };

    return {
        celsiusToFahrenheit: celsiusToFahrenheit,
        fahrenheitToCelsius: fahrenheitToCelsius,
        formatTime: formatTime,
        readUTF8String: readUTF8String,
        fletcherChecksum: fletcherChecksum
    };

}(utils));

