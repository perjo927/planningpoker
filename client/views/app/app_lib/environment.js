App = {
    "UI": {},
    "Collection": {},
    "Plugin": {},
    "Http": {}
};


/* */
App.UI.parseForm = function(event) {
    var formContainer = {};
    var form = $(event.target).serializeArray();

    form.forEach(function (element, index, array) {
        formContainer[element.name] = element.value;
    });
    return formContainer;
};

App.UI.countdown = {};

App.UI.countdown.interval = 100;
App.UI.countdown.timerStart = 6000;
App.UI.countdown.count = 6000;
App.UI.countdown.counter = 0;

App.UI.countdown.timer = function() {
    App.UI.countdown.count = App.UI.countdown.count - App.UI.countdown.interval;
    Session.set("timer", App.UI.countdown.count);

    if (App.UI.countdown.count <= 0)
    {
        Meteor.clearInterval(App.UI.countdown.counter);
        App.UI.countdown.count = 6000;
        App.UI.countdown.callback();
        return;
    }
};

/* */

App.Collection.insert = function (collection, document, callback) {
    collection.insert(document, function (error, id) {
        if (!!error) {
            //console.error(error);
        } else {
            //console.info(id);
            if (!!callback) {
                callback();
            }
        }
    });
};

//
App.Collection.update = function (collection, id, modifier, callback) {
    collection.update(id, modifier, function (error, id) {
        if (!!error) {
            //console.error("Features update", error);
        } else {
            //console.info("Features update", id);
            if (!!callback) {
                callback();
            }
        }
    });
};

App.Collection.remove = function (collection,_id, callback) {
    collection.remove(_id, function (error) {
        if(!!error) {
            //console.error(error);
        } else {
            //console.info("Removed",docViewer)
            if (!!callback) {
                callback();
            }
        }
    });
};

App.Collection.findOne = function (collection, query) {
    if (!query) {
        return collection.findOne();
    }
    return collection.findOne(query);
};

App.Collection.find = function (collection, query) {
    if (!query) {
        return collection.find();
    }
    return collection.find(query);
};

/* HTTP */
// TODO: Set App.setCookie

App.Http.call = function (method, url, data, successCallback) {
    HTTP.call(method, url, data, function (error, result) {
        if (!!error) {
            console.error(error);
        } else {
            console.info(result);
            successCallback();
        }
    });
};

