// TODO: Accounts, identification, roles

var access = function (insertRestriction, updateRestriction, removeRestriction) {
    return {
        insert: function (user, doc) {
            return insertRestriction;
        },
        update: function(user, doc, fields, modifier) {
            return updateRestriction;
        },
        remove: function(user, doc) {
            return removeRestriction;
        }
    };
};

var creatorAccess = function (fetch, insertRestriction, updateRestriction, removeRestriction) {
    var insert = insertRestriction || function (user, doc) {
        return !!user;
    };
    var update = updateRestriction || function(user, doc, fields, modifier) {
        return doc.creator === user;
    };
    var remove = removeRestriction || function(user, doc) {
        return doc.creator === user;
    };

    return {
        insert: insert,
        update: update,
        remove: remove,
        fetch: fetch
    };
};


/* */
Collections.presentation["estimates"].allow(access(false, false, false));
Collections.presentation["estimations"].allow(creatorAccess(['creator']));
Collections.presentation["rooms"].allow(creatorAccess(['creator']));
Collections.presentation["viewers"].allow(creatorAccess(['creator']));

// Room owner to create features only
Collections.presentation["features"].allow(creatorAccess(['creator', 'roomId']), function (user, doc) {
    return (!!user && doc.roomId === user);
});


