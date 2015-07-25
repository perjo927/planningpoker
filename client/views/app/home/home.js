

var createNewRoom = function (event) {
    var newRoom = App.UI.parseForm(event);
    newRoom.color = Session.get("selectedRoomColor");
    newRoom.creator = Meteor.userId();
    newRoom.sessionInProgress = false;
    newRoom.estimates = "Fibonacci Extended";

    return newRoom;
};

var insertNewRoom = function (newRoom) {
    var collection = Collections.presentation["rooms"];

    collection.insert(newRoom, function (error, _id) {
        if(!!error) {
            //console.error("Rooms.insert error", error)
        } else {
            //console.info("Rooms.insert:", _id, newRoom)
        }
    });
};


//
Template.home.onRendered(function () {
    this.$('.modal-trigger').leanModal();
});

Template.room_creator.events({
    'submit form': function (event,template) {
        event.preventDefault();

        var newRoom = createNewRoom(event);
        insertNewRoom(newRoom);

    },
    'change select': function (event, template) {
        Session.set("selectedRoomColor", event.target.value);
    }
});

Template.room_creator.helpers({

});