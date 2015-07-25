// Most subscriptions will be used in Iron Router

CreateSubscriptions = function(subscriptionsObject) {
    var subscriptions = [];

    Object.keys(subscriptionsObject).forEach(function(collection) {
        var parameters = subscriptionsObject[collection];
        if (parameters === false) {
            subscriptions.push(Meteor.subscribe(collection));
        } else {
            subscriptions.push(Meteor.subscribe(collection, parameters));
        }
    });
    return subscriptions;
};

/* Meteor.subscribe("foo"); */
