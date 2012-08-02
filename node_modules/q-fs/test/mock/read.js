"use strict";

var Q = require("q");
var FS = require("../../q-fs");
var Root = FS.Root;
var Mock = FS.Mock;
var ASSERT = require("assert");

exports['test merge'] = function (ASSERT, done) {

    var readed = FS.mock(FS, FS.join(__dirname, 'dummy'));

    Q.when(readed, function (readed) {
        return Q.when(readed.listTree(), function (list) {
            ASSERT.deepEqual(list.sort(), [
                ".", "hello.txt"
            ].sort(), 'listTree');
        }).then(function () {
            return Q.when(readed.read("hello.txt"), function (hello) {
                ASSERT.strictEqual(hello, 'Hello, World!\n', 'read content');
            });
        });
    })
    .fin(done)
    .end()

};

if (require.main === module) {
    require("test").run(exports);
}


