
var FS = require("q-fs");
var location = FS.join(module.directory || __dirname, '..', 'package.json');

FS.read(location, {charset: 'utf-8'})
.then(function (content) {
    console.log(content);
})
.end()

