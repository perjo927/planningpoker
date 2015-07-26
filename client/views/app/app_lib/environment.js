App = {};
App.UI = {};
App.Collection = {};



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
App.Collection.remove = function (collection,_id) {
    collection.remove(_id, function (error) {
        if(!!error) {
            //console.error(error);
        } else {
            //console.info("Removed",docViewer)
        }
    });
};

//
App.Collection.update = function (collection, id, modifier) {
    collection.update(id, modifier, function (error, id) {
        if (!!error) {
            //console.error("Features update", error);
        } else {
            //console.info("Features update", id);
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

//
App.Collection.insert = function (collection, document) {
    collection.insert(document, function (error, id) {
        if (!!error) {
            //console.error(error);
        } else {
            Session.set("docViewer", id)
        }
    });
};