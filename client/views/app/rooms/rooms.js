Template.room.onDestroyed(function () {
    console.log("WAT!", this);
    var docViewer = Session.get("docViewer");
    //this.data.viewers.
    Collections.presentation["viewers"].remove(docViewer, function (error) {
        if(!!error) {
            console.error(error);
        } else {
            console.info("Removed",docViewer)
        }
    })
});

Template.room.helpers({
    //"participants": function () {
    //    var roomViewers = Session.get("roomViewers");
    //    var thisRoomViewers = roomViewers[this.room._id];
    //    console.debug(thisRoomViewers);
    //    return thisRoomViewers;
    //}
});