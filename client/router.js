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


// TODO: routeName
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