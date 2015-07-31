;'use strict';

var setCookie = function () {

};

var logIn = function (callback) {
    Meteor.call('getYouTrackBot', function (error, credentials) {
        if (!!error) {
            console.error(error);
        } else {
            // Login
            var url = "https://tracking.betsson.local/rest/user/login";//
            var successCallback = function (result) {
              // TODO: set cookie here
                console.info("result",result.headers);
                callback(result);
            };

            var res =  App.Http.call("POST", url, {
                content: "login=" + credentials.login + "&password=" +  credentials.password,
                headers: {
                    "Cache-Control": "no-cache",
                    "Content-Type" :"application/x-www-form-urlencoded"
                }
            }, successCallback);
        }
    });

};

var makeQuery = function (max, withs, filter) {
    var params = "max=" + max;
    withs.forEach(function (param, index, array) {
      params += ("&with=" + param);
    });
    params += ("&filter=" + filter);

    return params;
};


App.Plugin.YouTrack = {};

//
App.Plugin.YouTrack.getFromServer = function (features, callback) {
    var that = this;
    var method = "GET";
    var url = "https://tracking.betsson.local/rest/issue?";
    var query = makeQuery("5",
        ["state", "Brand", "summary", "description", "Prio", "Estimated Days" ],
        "Project: {Realm Backlog} sort by: Prio desc #XXX #Feature"
    );
    url += query;

    // TODO: If logged in , use cookie
    logIn(function () {
        var successCallback = function (result) {
            // TODO: that.callback() if callback
            // TODO: do something with featrues
            console.debug("result", result.headers);
        };
        App.Http.call(method, url, successCallback);

    });





    // Fetch issues
    //console.debug(url);

};
