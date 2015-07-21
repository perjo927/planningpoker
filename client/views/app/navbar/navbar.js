
//
Template.navbar.onRendered(function () {
    this.$('.button-collapse').sideNav();
    this.$(".dropdown-button").dropdown();
    //$('.scrollspy').scrollSpy();
});


Template.navbar.helpers({

});

/* */
Template.navbar.events({
    "click #sign-out": function (event,template) {
        Meteor.logout();
    }
});