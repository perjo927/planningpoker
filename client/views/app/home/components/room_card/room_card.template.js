
/* */
Template.room_card.events({
    "click #remove-room": function () {
        if (this.creator === Meteor.userId()) {
            Materialize.toast(
                '<span>Delete room? &nbsp;</span>' +
                '<span class="btn-flat yellow-text" id="delete-room" ' +
                'onclick= Collections.presentation.rooms.remove(\'' +
                this._id +
                '\')>' +
                ' DELETE ' +
                '</span>', 5000
            );
        }
    }
});


Template.room_card.helpers({
    "isCreator": function (roomCreator) {
        return Meteor.userId() === roomCreator;
    }
});