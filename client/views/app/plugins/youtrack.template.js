

Template.plugin_youtrack.events({
    'click #youtrack': function (event) {
        event.preventDefault();

        // TODO: features
        var features = {};
        App.Plugin.YouTrack.getFromServer(features);
    }
});
