var renderDefault = function(router) {

    router.render('navbar', {
        to: "navbar"
        //data: function () {
        //    return {
        //        content: VM.sections["navbar"].service.getContent()
        //    }
        //}
    });
    router.render('footer', {
        to: "footer"
        //data: function () {
        //    return {
        //        content: VM.sections["footer"].service.getContent()
        //    }
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
                "estimates",
                "estimations",
                "rooms",
                "features" // TODO: subscribe only to relevant features
            ]);
        },
        action: function(){
            var router = this;
            var params = router.params;

            renderDefault(router);

            router.render('room', {
                //data: function () {
                //    var content = VM.sections["bars"].service.getContent();
                //    return {
                //        content: {
                //            skillType: params._id,
                //            skills: content().skills
                //        }
                //    }
                //}
            });

        }
    }
);