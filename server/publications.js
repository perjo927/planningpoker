//
var findAllInRoom = function (collection, roomId, userId) {
    check(collection, String);
    check(roomId, String);
    check(userId, String);


    if (!!userId) {
        return Collections.presentation[collection].find({roomId: roomId});
    } else {
        return [];
    }
};



/* */
Meteor.publish("estimates", function () {
    if (!!this.userId) {
        return Collections.presentation["estimates"].find();
    } else {
        return [];
    }
});


Meteor.publish("rooms", function () {
    if (!!this.userId) {
        return Collections.presentation["rooms"].find();
    } else {
        return [];
    }
});

Meteor.publish("roomId", function (roomId) {
    check(roomId, String);
    if (!!this.userId) {
        return Collections.presentation["rooms"].find({_id: roomId});
    } else {
        return [];
    }
});

Meteor.publish("estimationsPerRoom", function (roomId) {
    return findAllInRoom("estimations", roomId, this.userId);
});

Meteor.publish("viewersPerRoom", function (roomId) {
    return findAllInRoom("viewers", roomId, this.userId);
});

Meteor.publish("featuresPerRoom", function (roomId) {
    return findAllInRoom("features", roomId, this.userId);
});

