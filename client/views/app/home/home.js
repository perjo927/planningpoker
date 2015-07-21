var parseForm = function(event) {
    var formContainer = {};
    var form = $(event.target).serializeArray();

    form.forEach(function (element, index, array) {
        formContainer[element.name] = element.value;
    });

    return formContainer;
};

//
Template.home.onRendered(function () {
    this.$('.modal-trigger').leanModal();
});

Template.room_creator.events({
    'submit form': function (event,template) {
        event.preventDefault();
        var formContainer = parseForm(event);

        console.debug("form submit", formContainer);
    },
    'change select': function (event, template) {
        console.debug("select",event.target);
    }
});