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
        //waitOn: function() {
        //    return CreateSubscriptions([
        //        "navbar",
        //        "footer",
        //        "home"
        //    ]);
        //},
        action: function(){
            var router = this;
            var params = router.params;

            router.render('home', {
                //data: function () {
                //    return {
                //        content: VM.sections["home"].service.getContent()
                //    }
                //}
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
        //waitOn: function() {
        //    return CreateSubscriptions([
        //        "navbar",
        //        "footer",
        //        "bars"
        //    ]);
        //},
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