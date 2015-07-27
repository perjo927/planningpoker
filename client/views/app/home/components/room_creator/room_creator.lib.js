RoomCreator = {};

RoomCreator.createNewRoom = function (event) {
    var newRoom = App.UI.parseForm(event);
    newRoom.color = Session.get("selectedRoomColor");
    newRoom.creator = Meteor.userId();
    newRoom.sessionInProgress = false;
    newRoom.estimates = "Fibonacci Extended";

    return newRoom;
};

RoomCreator.insertNewRoom = function (newRoom) {
    var collection = Collections.presentation["rooms"];
    App.Collection.insert(collection, newRoom);
};