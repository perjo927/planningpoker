var parseForm = function(event) {
    var formContainer = {};
    var form = $(event.target).serializeArray();

    form.forEach(function (element, index, array) {
        formContainer[element.name] = element.value;
    });

    return formContainer;
};

//
Template.home.onRendered(function () {
    this.$('.modal-trigger').leanModal();
});

Template.room_creator.events({
    'submit form': function (event,template) {
        event.preventDefault();
        var newRoom = parseForm(event);
        newRoom.color = Session.get("selectedRoomColor");

        var collection = Collections.presentation["rooms"];
        collection.insert(newRoom, function (error, _id) {
            if(!!error) {
                console.error("Rooms.insert error", error)
            } else {
                console.info("Rooms.insert:", _id, newRoom)
            }
        });
    },
    'change select': function (event, template) {
        Session.set("selectedRoomColor", event.target.value);
    }
});