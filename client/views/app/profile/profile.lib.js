Profile = {};

Profile.updateProfile = function (field) {
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
};