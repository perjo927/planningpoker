Meteor.AppCache.config({
    chrome: false,
    firefox: false,
    ie: false,
    safari: false,
    chromium: false
});

Meteor.AppCache.config({
    onlineOnly: [
        //'/packages/jquery.js', // example
    ]
});