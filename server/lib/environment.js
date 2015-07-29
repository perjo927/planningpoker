Server = {
    "Methods": {}
};

Server.Methods.ParseAssets = function (asset) {
    var assets = JSON.parse(Assets.getText('assets.json'));
    return assets[asset];
};