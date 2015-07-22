
var renderDefault = function(router) {

    router.render('navbar', {
        to: "navbar"
    });
    router.render('footer', {
        to: "footer"
        //}
    });
};

// TODO: dashboard, account settings, admin
/* */
Router.route('/', {
        name: "home",
        loadingTemplate: "loading",
        layoutTemplate: "app",
        waitOn: function() {
            return CreateSubscriptions([
                "rooms"
            ]);
        },
        action: function(){
            var router = this;
            var collection = Collections.presentation["rooms"];
            var rooms = collection.find();

            router.render('home', {
                data: function () {
                    return {
                        rooms: collection.find()
                    }
                }
            });
            renderDefault(router);
        }
    }
);
// TODO: If not meteor user - redirect / router.go to home


Router.route('/rooms/:_id', {
        name: "room",
        loadingTemplate: "loading",
        layoutTemplate: "app",
        waitOn: function() {
            return CreateSubscriptions([
                "estimates", // TODO: specific room subscriptions
                "estimations", // TODO: specific room subscriptions
                "rooms", // TODO: specific room subscriptions
                "features", // TODO: subscribe only to relevant features
                "viewers" // TODO: subscribe only to relevant viewers
            ]);
        },
        action: function(){
            var router = this;
            var params = router.params;
            var roomId = params._id;
            var user = Meteor.user();
            var email = user.emails[0].address,
                userId = user._id;

            // TODO: Fetch specific for all
            var estimates = Collections.presentation["estimates"].find({"roomId": roomId});
            var estimations = Collections.presentation["estimations"].find();
            var features = Collections.presentation["features"];
            var room = Collections.presentation["rooms"].findOne(roomId);
            var viewers = Collections.presentation["viewers"];

            // TODO : extract method
            var myRoomViewer = viewers.findOne({
                "roomId": roomId,
                "userId": userId
            });

            if (!!myRoomViewer) {
                Session.set("docViewer", myRoomViewer._id);
            } else {
                viewers.insert({
                    "roomId": roomId,
                    "userId": userId,
                    "email": email
                }, function (error, id) {
                    if(!!error) {
                        //console.error(error);
                    } else {
                        Session.set("docViewer", id)
                    }
                });
            }

            renderDefault(router);
            router.render('room', {
                data: function () {
                    return {
                        "estimates": estimates,
                        "estimations": estimations,
                        "features:": features,
                        "room": room,
                        "viewers": viewers.find({"roomId": roomId})
                    }
                }
            });

        }
    }
);