var makeUserLeaveRoom = function () {
    var docViewer = Session.get("docViewer");

    Collections.presentation["viewers"].remove(docViewer, function (error) {
        if(!!error) {
            console.error(error);
        } else {
            console.info("Removed",docViewer)
        }
    })
};

var getEstimateUnit = function (roomEstimateUnit, estimatesCollection) {
    var estimatesList = [];
    var desiredEstimate = roomEstimateUnit;

    estimatesCollection.forEach(function (element,index,array) {
        if (element.name === desiredEstimate) {
            estimatesList = element.list;
        }
    });

    return estimatesList;
};

var isCreator = function (roomCreatorId) {
    return Meteor.userId() === roomCreatorId;
};

var flipSessionInProgress = function (roomId, newValue) {
    Collections.presentation["rooms"].update(roomId, {$set:
    {sessionInProgress: newValue }
    });
};

var updateRoomEstimate = function (roomId, newValue) {
    Collections.presentation["rooms"].update(roomId, {$set:
    {estimates: newValue }
    });
};

//
Template.room.onDestroyed(function () {
    makeUserLeaveRoom();
});

Template.room.helpers({
    "isCreator": function (roomCreatorId) {
        return isCreator(roomCreatorId);
    }
});

Template.room_header.helpers({
    "isCreator": function (roomCreatorId) {
        return isCreator(roomCreatorId);
    }
});


// TODO: use common methods
Template.room_header.events({
    "click #lock": function (event, template) {
        flipSessionInProgress(template.data.room._id, true);
    },
    "click #unlock": function (event, template) {
        flipSessionInProgress(template.data.room._id, false);
    }
});

Template.timer.helpers({
    "isCreator": function (roomCreatorId) {
        return isCreator(roomCreatorId);
    }
});

Template.estimation.helpers({
    "getEstimate": function () {
        return getEstimateUnit(this.room.estimates, this.estimates);
    }
});

//
Template.estimation_admin.helpers({
    "getEstimate": function () {
        return getEstimateUnit(this.room.estimates, this.estimates);
    }
});

Template.estimation_admin.events({
    "change select": function (event, template) {
        updateRoomEstimate(template.data.room._id, event.target.value);
    }
});

//
Template.feature_card.helpers({
    "isCreator": function (roomCreatorId) {
        return isCreator(roomCreatorId);
    },
    "editingEstimate": function () {
        return Session.get("editingEstimate");
    },
    "getEstimate": function () {
        return getEstimateUnit(this.room.estimates, this.estimates);
    },
    "getFeature": function () {
        var featuresList = this.features.find({roomId: this.room._id, state: "doing"}).fetch();
        console.debug(featuresList);
        // TODO: check count > 0, returnera tom lista eller placeholder-objekt med samma fields
        // fetch top priority (0)
        return featuresList[0];
    }
});

Template.feature_card.events({
    "click #set-new-estimate": function (event, template) {
        console.debug(event,template);
        Session.set("editingEstimate", true);
    },
    "change select": function (event, template) {
        console.debug(event.target.value,template);
        //updateFeatureEstimate(template.data.room._id, event.target.value);
        //// TODO: Change feature estimate to value, get feature id from button click, or template data, or id
        Session.set("editingEstimate", false);
    }
});