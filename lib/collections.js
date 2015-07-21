// Runs in both client and server contexts

Collections = {
    "presentation": {},
    "server": {}
};

// Presentation collections to create
ContentAreas =
    [
        "rooms",
        "features",
        "estimates"
    ];

ContentAreas.forEach(function (area) {
    Collections.presentation[area] = new Mongo.Collection(area);
});
