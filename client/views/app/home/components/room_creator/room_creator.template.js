

Template.room_creator.events({
    'submit form': function (event) {
        event.preventDefault();

        var newRoom = RoomCreator.createNewRoom(event);
        RoomCreator.insertNewRoom(newRoom);

    },
    'change select': function (event) {
        Session.set("selectedRoomColor", event.target.value);
    }
});
