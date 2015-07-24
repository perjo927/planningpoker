var makeUserLeaveRoom = function () {
    var docViewer = Session.get("docViewer");

    Collections.presentation["viewers"].remove(docViewer, function (error) {
        if(!!error) {
            //console.error(error);
        } else {
            //console.info("Removed",docViewer)
        }
    })
};

var upsertFeature = function (id, newFeature, template, state) {
    newFeature.roomId = template.data.room._id;
    newFeature.state = state;

    // If not previously estimated, insert, else update
    if (id === "new"){
        newFeature.estimate = "?";
        // TODO: extract method
        template.data.features.insert(newFeature, function (error, _id) {
            if (!!error) {
                //console.error("Features.insert error", error)
            } else {
                //console.info("Features.insert:", _id, newFeature)
            }
        });
    } else {
        // TODO: extract method
        Object.keys(newFeature).forEach(function (key, index) {
            if (key !== 'roomId') {
                var field = {};
                field[key] = newFeature[key];

                template.data.features.update(id, {$set: field }, function (error, _id) {
                    if(!!error) {
                        //console.error("Features.update error", error)
                    } else {
                        //console.info("Features.update:", _id, newFeature)
                    }
                });
            }
        });
    }
};

var getFeatures = function (state, context) {
    if (!state) {
        state = "doing"
    }
    var featuresList = context.features.find({roomId: context.room._id, state: state}).fetch();
    return featuresList;
};

var getFeature = function (state, context) {
    var featuresList = getFeatures(state, context);
    //
    if (featuresList.length === 0 ) {
        return {
            roomId: "123xyz",
            title: "Out of features",
            brand: "Please",
            description: "create new features if you are admin.",
            link: "#",
            estimate: "?",
            state: "doing" // todo, doing, done
        }
    }
    // fetch top priority (0)
    return featuresList[0];
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
Template.room.onRendered(function () {
    this.$('.modal-trigger').leanModal();
});

// TODO: same action as when leaving manually
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
    "getFeature": function (state) {
        var feature = getFeature(state, this);
        return feature;
    }
});

Template.feature_card.events({
    "click #set-new-estimate": function (event, template) {
        if (template.data.room.creator === Meteor.userId()) {
            Session.set("editingEstimate", "todo");
        }
    },
    "change select": function (event, template) {
        console.debug(event.target.value,template);
        //updateFeatureEstimate(template.data.room._id, event.target.value);
        //// TODO: Change feature estimate to value, get feature id from button click, or template data, or id
        Session.set("editingEstimate", false);
    }
});

/* */
Template.feature_editor.events({
    "click #stop-editing": function () {
        Session.set("editingFeature", false);
    },
    "click .add-feature": function () {
        Session.set("editingFeature", "new");
    },
    "change select": function (event, template) {
        Session.set("selectedFeatureState", event.target.value);
    },
    "submit form": function (event, template) {
        event.preventDefault();
        var newFeature = App.parseForm(event);
        var id = Session.get("editingFeature");
        var state = Session.get("selectedFeatureState");
        upsertFeature(id, newFeature, template, state);
        Session.set("editingFeature", false);
    }
});

Template.feature_editor.helpers({
    "editingFeature": function () {
        return Session.get("editingFeature");
    },
    "getFeatures": function (state) {
        var featureList = getFeatures(state, this);
        return featureList;
    }
});

/* */

Template.feature_form.helpers({
    "getEditingFeature": function () {
        var featureId = Session.get("editingFeature", featureId);
        var feature = this.features.findOne(featureId);
        return feature;
    }
});


/* */

Template.feature_column.events({
    "click .edit-feature": function (event, template) {
        Session.set("editingFeature", this._id);
    }
});