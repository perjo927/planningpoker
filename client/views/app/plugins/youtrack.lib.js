;'use strict';

var setCookie = function () {

};

var logIn = function () {
    Meteor.call('getYouTrackBot', function (error, credentials) {
        if (!!error) {
            console.error(error);
        } else {
            // Login
            var url = "https://tracking.betsson.local/rest/user/login?" +
                "login=" + credentials.login +
                "&password=" + credentials.password;
            var successCallback = function () {
              // TODO: set cookie here

            };

            App.Http.call("POST", url, credentials, successCallback);
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
    // TODO: If logged in , use cookie
    logIn();
    var method = "GET";
    var url = "https://tracking.betsson.local/rest/issue?";
    var query = makeQuery("5",
        ["state", "Brand", "summary", "description", "Prio", "Estimated Days" ],
        "Project: {Realm Backlog} sort by: Prio desc #XXX #Feature"
    );
    url += query;

    console.debug(url);

    var successCallback = function (result) {
      // TODO: that.callback() if callback
        // TODO: do something with featrues
    };

    // Fetch issues
    App.Http.call(method, url, successCallback);
};
