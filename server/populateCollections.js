
for (var collection in Collections["presentation"]) {
    if (Collections["presentation"].hasOwnProperty(collection)) {
        var viewModel = VM.sections[collection];
        if (!!viewModel) {
            var c = Collections.presentation[collection];

            if (c.find().count() === 0) {
                viewModel.forEach(function (element, index, array) {
                    c.insert(element);
                });

            }
        }
    }
}

