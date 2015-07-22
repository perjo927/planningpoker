// TODO: Accounts, identification, roles

var fullAccess = {
    insert: function (user, doc) {
        return true;
    },
    update: function(user, doc) {
        return true;
    },
    remove: function(user, doc) {
        return true;
    }
};

ContentAreas.forEach(function (area) {
    Collections.presentation[area].allow(fullAccess);
});
