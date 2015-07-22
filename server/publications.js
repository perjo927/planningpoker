var publishCollection = function (collection) {
    Meteor.publish(collection, function(parameters) {
        if(!!parameters) {
            check(parameters, [Match.Any]);
        }
        return Collections.presentation[collection].find();
    });
};

 // Collections to publish
ContentAreas.forEach(function (area) {
    publishCollection(area);
});