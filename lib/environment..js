var getCollections = function () {
    var sections = {};

    for (var collection in Collections["presentation"]) {
        if (Collections["presentation"].hasOwnProperty(collection)) {
            sections[collection] = {
                "docs": {},
                "service": {}
            }
        }
    }
    return sections;
};

VM = {
    "FindContentItems": function (collectionId, property) {
        var collection = Collections.presentation[collectionId];

        return function () {
            var doc = collection.findOne();

            if (!!doc) {
                if (!!property) {
                    // Return whole content object
                    return doc.content[property];
                }
                // Return individual properties of content object
                return doc.content;
            }
            return {};
        };
    },
    "GetCollectionId": function (collectionId) {
        var collection = Collections.presentation[collectionId];

        return function () {
            var doc = collection.findOne();

            if (!!doc) {
                return doc._id;
            }
            return undefined;
        };
    },
    "sections": getCollections()
};