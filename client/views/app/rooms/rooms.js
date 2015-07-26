// TODO: Extract app.collection.remove, etc.

var startTimer = function () {
    resetAverage(Collections.presentation["estimations"]);

    App.UI.countdown.callback = function() {
        Session.set("countingDown", false);

        var estimation = Session.get("chosenEstimation");
        var estimations = Collections.presentation["estimations"];
        var room = Collections.presentation["rooms"].findOne();

        insertEstimation(estimations, estimation, room._id, Meteor.userId());
        // flipCards + unFlipCards
        // TODO:  flip cards, calculate averge
    };

    App.UI.countdown.counter = Meteor.setInterval(App.UI.countdown.timer, App.UI.countdown.interval);
};

var resetAverage = function (estimations) {
    estimations.find().forEach(function (element,index,array) {
        var value = element.estimation;
        if (value !== "?") {
            App.Collection.update(estimations, element._id, {$set: {value: "?"}})
        }
    });
};

var calculateAverage = function (estimations) {
    var total = 0, count = 0, average = 0;

    estimations.find().forEach(function (element,index,array) {
        var value = element.estimation;
        if (value !== "?") {
            total += parseInt(value, 10);
            count++;
        }
    });

    if (total !== 0 && count !== 0) {
        average = total / count;
        return average;
    }

    return 0;
};

var getEstimation = function (userId) {
    var estimation = Collections.presentation["estimations"].findOne(userId);
    return estimation;
};

var insertEstimation = function (estimations, estimation, roomId, userId) {
    var callback = function () {
        Session.set("averageReady", true);
    };

    var myEstimation = App.Collection.findOne(estimations, userId);

    if (!!myEstimation) {
        if (myEstimation.roomId !== roomId) {
            App.Collection.update(estimations, userId, {$set: {roomId: roomId}})
        }
        App.Collection.update(estimations, userId, {$set: {estimation: estimation}}, callback)
    } else {
        App.Collection.insert(estimations, {
            "_id": userId,
            "roomId": roomId,
            "estimation": estimation,
            "creator": userId
        }, callback);
    }
};

var makeUserLeaveRoom = function () {
    var docViewer = Session.get("docViewer");
    App.Collection.remove(Collections.presentation["viewers"], docViewer);
};

var moveFeatureToState = function (id, state, features) {
    App.Collection.update(features, {_id: id}, {$set: {state: state}});
    // Pick the next doing, or todo (?)
    var hasDoing = features.find({state: "doing"}).count() > 0;
    if (hasDoing) {
        return;
    }
    var todos = features.find({state: "todo"}).fetch();
    if (todos.length > 0) {
        var promoteId = todos[0]._id;
        App.Collection.update(features, {_id: promoteId}, {$set: {state: "doing"}});
    }

};

var removeFeature = function (id) {
    Collections.presentation["features"].remove(id, function (error) {
        if(!!error) {
            //console.error(error);
        } else {
            //console.info("Removed",id)
        }
    });
};

var updateFeatureEstimate = function (newEstimate, featureId, features) {
    App.Collection.update(features, {_id: featureId}, {$set: {estimate: newEstimate}});
};

// TODO: Refactor ?
var upsertFeature = function (id, newFeature, template, state, estimate) {
    // TODO: Object initialization
    newFeature.roomId = template.data.room._id;
    newFeature.state = state;
    newFeature.estimate = estimate;
    newFeature.creator = Meteor.userId();

    // If not previously estimated, insert, else update
    if (id === "new"){
        newFeature.estimate = "?";
        newFeature.state = "todo";

        // TODO: app.collection
        template.data.features.insert(newFeature, function (error, _id) {
            if (!!error) {
                //console.error("Features.insert error", error)
            } else {
                //console.info("Features.insert:", _id, newFeature)
            }
        });
    } else {
        Object.keys(newFeature).forEach(function (key, index) {
            if (key !== 'roomId') {
                var field = {};
                field[key] = newFeature[key];

                // TODO: app.collection
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

var isCreator = function (roomCreator) {
    return Meteor.userId() === roomCreator;
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

/* **** */

//
Template.room.onRendered(function () {
    this.$('.modal-trigger').leanModal();
    var that = this;

    Streamy.on('startTime', function(d, s) {
        if (d.roomId === that.data.room._id) {
            Session.set("countingDown", true);
            startTimer();
        }
    });
    Streamy.on('resetTime', function(d, s) {
        console.warn();
        if (d.roomId === that.data.room._id) {
            Session.set("averageReady", false);
            Session.set("chosenEstimation", "?");
        }
    });
});

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


//
Template.room_header.events({
    "click #lock": function (event, template) {
        flipSessionInProgress(template.data.room._id, true);
    },
    "click #unlock": function (event, template) {
        flipSessionInProgress(template.data.room._id, false);
    }
});

/* */
Template.timer.helpers({
    "isCreator": function (roomCreatorId) {
        return isCreator(roomCreatorId);
    },
    "isCountingDown": function () {
        return Session.get("countingDown");
    },
    "seconds": function () {
        return Math.floor(Session.get("timer")/1000);
    },
    "shadowValue": function () {
        var ms = Session.get("timer");
        var decimals = ms / 1000; // 5.900, 5.800, 5.700, ...
        var s = Math.floor(decimals); // 5, 5, 5, ...  4, 4, 4, ... , 3, ...
        var diff = decimals - s; // 9, 8, 7, 6, ...
        var shadowValue = diff*15;
        return shadowValue;
    },
    "isAverageReady": function () {
        return Session.get("averageReady");
    },
    "average": function () {
        return calculateAverage(this.estimations);
    }
});

Template.timer.events({
    "click #timer-start": function (event, template) {
        Streamy.broadcast('startTime', { roomId: template.data.room._id });
    },
    "click #timer-reset": function (event, template) {
        Streamy.broadcast('resetTime', { roomId: template.data.room._id });
    }
});

/* */
// TODO: Extract common methods for estimation and admin, "inheritance"

Template.estimation.helpers({
    "getEstimate": function () {
        return getEstimateUnit(this.room.estimates, this.estimates);
    },
    "disabled": function () {
        return ( Session.equals("countingDown", true) ) ? "" : "disabled";
    },
    "myEstimate": function () {
        return Session.get("chosenEstimation");
    },
    "isCountingDown": function () {
        return Session.get("countingDown");
    }
});

Template.estimation.events({
    "click .estimate": function (event) {
        if (Session.equals("countingDown", true)) {
            var estimation = event.target.title;
            Session.set("chosenEstimation", estimation);
        }
    }
});

//
Template.estimation_admin.helpers({
    "getEstimate": function () {
        return getEstimateUnit(this.room.estimates, this.estimates);
    },
    "disabled": function () {
        return (Session.equals("countingDown", true)) ? "" : "disabled";
    },
    "isCountingDown": function () {
        return Session.get("countingDown");
    },
    "myEstimate": function () {
        return Session.get("chosenEstimation");
    }
});

Template.estimation_admin.events({
    "change select": function (event, template) {
        updateRoomEstimate(template.data.room._id, event.target.value);
    },
    "click .estimate": function (event) {
        if (Session.equals("countingDown", true)) {
            var estimation = event.target.title;
            Session.set("chosenEstimation", estimation);
        }
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
            Session.set("editingEstimate", true);
        }
    },
    "click #move-to-done": function (event, template) {
        var featureId = event.target.title;
        var features = template.data.features;
        moveFeatureToState(event.target.title, "done", features);
    },
    "change select": function (event, template) {
        var newEstimate = event.target.value;
        var featureId = event.target.title;
        var features = template.data.features;
        updateFeatureEstimate(newEstimate, featureId, features);

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
    "change select#state": function (event, template) {
        Session.set("selectedFeatureState", event.target.value);
    },
    "submit form": function (event, template) {
        event.preventDefault();
        var newFeature = App.UI.parseForm(event);
        var id = Session.get("editingFeature");
        var state = Session.get("selectedFeatureState");
        var estimate = Session.get("selectedFeatureEstimate");
        upsertFeature(id, newFeature, template, state, estimate);
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
    },
    "getEstimate": function () {
        return getEstimateUnit(this.room.estimates, this.estimates);
    },
    "newFeature": function () {
        return Session.equals("editingFeature", "new");
    }
});


Template.feature_form.events({
    "change select#change-estimate": function (event, template) {
        Session.set("selectedFeatureEstimate", event.target.value);
    }
});

/* */
Template.feature_column.events({
    "click .edit-feature": function (event, template) {
        Session.set("selectedFeatureState", this.state);
        Session.set("selectedFeatureEstimate", this.estimate);
        Session.set("editingFeature", this._id);
    },
    "click .remove-feature": function (event, template) {
        removeFeature(this._id);
    }
});

/* */
Template.participants.helpers({
    "isAverageReady": function () {
        return Session.get("averageReady");
    },
    "estimation": function () {
        var estimation = getEstimation(this._id);
        return estimation;
    }
});