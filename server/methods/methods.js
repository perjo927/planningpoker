Meteor.methods({
    "getYouTrackBot": function () {
        //check(arguments, [String]);
        // TODO: Real bot credentials
        var bot = Server.Methods.ParseAssets("youtrackbot");
        return bot;
    }
});

