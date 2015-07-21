// Most subscriptions will be used in Iron Router

CreateSubscriptions = function(subsArray) {
    var subscriptions = [];
    subsArray.forEach(function(collection) {
        subscriptions.push(Meteor.subscribe(collection));
    });
    return subscriptions;
};

/* Meteor.subscribe("foo"); */
