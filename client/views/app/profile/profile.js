
Template.profile.helpers({
    editingName: function () {
        return Session.equals("editingProfile", "names")
    },
    editingEmail: function () {
        return Session.equals("editingProfile", "emails")
    },
    editingTagline: function () {
        return Session.equals("editingProfile", "taglines")
    },
    editingAvatar: function () {
        return Session.equals("editingProfile", "avatars")
    }
});

Template.profile.events({
    "click .edit-profile": function (event) {
        Session.set("editingProfile", event.target.id);
    },
    "click .cancel": function () {
        Session.set("editingProfile", false);
    },
    "change select": function (event) {
        var path = "img/" + event.target.value + ".svg";
        Meteor.users.update(Meteor.userId(), {$set: {"profile.avatar": path}});
        Session.set("editingProfile", false);
    },
    "submit form": function (event) {
        event.preventDefault();
        var field = $(event.target).serializeArray()[0];

        // TODO: refactor
        switch (field.name) {
            case "username":
                Meteor.users.update(Meteor.userId(), {$set: {"profile.name": field.value}});
                break;
            case "email":
                Meteor.users.update(Meteor.userId(), {$set: {"emails[0].address": field.value}});
                break;
            case "tagline":
                Meteor.users.update(Meteor.userId(), {$set: {"profile.tagline": field.value}});
                break;
            default:
                break;
        }

        // parse field
        Session.set("editingProfile", false);
    }
});
