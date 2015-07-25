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


/* */
App.Collection.remove = function (_id) {

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

};
App.Collection.find = function (collection, query) {
    if (!query) {
        return collection.find();
    }
    return collection.find(query);
};

//
App.Collection.insert = function (collection, document) {

};