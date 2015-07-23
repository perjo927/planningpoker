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

//
Template.room.onDestroyed(function () {
    makeUserLeaveRoom();
});

Template.room.helpers({
    "isCreator": function (roomCreatorId) {
        return isCreator();
    }
});

Template.room_header.helpers({
    "isCreator": function (roomCreatorId) {
        return isCreator();
    }
});

Template.timer.helpers({
    "isCreator": function (roomCreatorId) {
        return isCreator();
    }
});

Template.estimation.helpers({
    "getEstimate": function () {
      return getEstimateUnit(this.room.estimates, this.estimates);
    }
});
Template.estimation_admin.helpers({
    "getEstimate": function () {
        return getEstimateUnit(this.room.estimates, this.estimates);
    }
});