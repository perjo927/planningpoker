
var renderDefault = function(router) {

    router.render('navbar', {
        to: "navbar"
    });
    router.render('footer', {
        to: "footer"
        //}
    });
};

var setRoomViewer = function (viewers, roomId, userId, email) {
    var myRoomViewer = App.Collection.findOne(viewers, userId);

    if (!!myRoomViewer) {
        Session.set("docViewer", myRoomViewer._id);
        if (myRoomViewer.roomId !== roomId) {
            App.Collection.update(viewers, userId, {$set: {roomId: roomId}})
        }
    } else {
        App.Collection.insert(viewers, {
            "_id": userId,
            "roomId": roomId,
            "email": email,
            "creator": userId
        });
    }
};

// TODO: Auth redirect / iron auth / Router.go
// TODO: profile settings
/* */
Router.route('/', {
    name: "home",
    loadingTemplate: "loading",
    layoutTemplate: "app",
    waitOn: function() {
        return CreateSubscriptions({
            "rooms": false
        });
    },
    action: function(){
        var router = this;
        var rooms = Collections.presentation["rooms"].find();

        router.render('home', {
            data: function () {
                return {
                    rooms: rooms
                }
            }
        });
        renderDefault(router);
    }
});


Router.route('/rooms/:_id', {
    name: "room",
    loadingTemplate: "loading",
    layoutTemplate: "app",
    waitOn: function() {
        var router = this;
        var params = router.params;
        var roomId = params._id;

        var subscriptions = {
            "roomId": roomId,
            "estimates": false,
            "estimationsPerRoom": roomId,
            "featuresPerRoom": roomId,
            "viewersPerRoom": roomId
        };
        return CreateSubscriptions(subscriptions);
    },
    action: function(){
        var router = this;
        var params = router.params;
        var roomId = params._id;
        var user = Meteor.user();
        var email = user.emails[0].address,
            userId = user._id;

        var estimates = Collections.presentation["estimates"].find();
        var estimations = Collections.presentation["estimations"];//.find();
        var features = Collections.presentation["features"];//.find();
        var room = Collections.presentation["rooms"].findOne(roomId);
        var viewers = Collections.presentation["viewers"];//.find();

        setRoomViewer(viewers, roomId, userId, email);
        renderDefault(router);
        router.render('room', {
            data: function () {
                return {
                    "estimates": estimates,
                    "estimations": estimations,
                    "features": features,
                    "viewers": viewers.find({"roomId": roomId}),
                    "room": room
                }
            }
        });

    }
});