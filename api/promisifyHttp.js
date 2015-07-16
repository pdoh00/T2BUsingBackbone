var promiseAPI = (function() {
    var get = function(url, responseType) {
        return new Promise(function(resolve, reject) {
            var request = new XMLHttpRequest();

            if ("withCredentials" in request) {
                //supported.
            }

            request.open('GET', url);
            request.responseType = responseType;

            request.onload = function() {
                if (request.status == 200) {
                    resolve(request.response);
                } else {
                    reject(Error(request.statusText));
                }
            };

            request.onerror = function(e) {
                console.error(e);
                reject(Error("Network Error"));
            };

            request.send();
        });
    };

    var put = function(url) {
        return new Promise(function(resolve, reject) {
            var request = new XMLHttpRequest();
            request.open('PUT', url);
            // request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
            request.onload = function() {
                if (request.status == 200) {
                    resolve(request.response);
                } else {
                    reject(Error(request.statusText));
                }
            };

            request.onerror = function() {
                reject(Error("Network Error"));
            };

            request.send();
        });
    };

    return {
        get:get,
        put:put
    };
})();
