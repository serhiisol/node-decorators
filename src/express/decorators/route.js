"use strict";
var utils_1 = require('../../utils');
function makeRouteMeta(target, key, descriptor, method, url) {
    var meta = utils_1.getExpressMeta(target);
    meta.routes[key] = { method: method, url: url };
    return descriptor;
}
var makeRoute = function (method, url) {
    return function (target, key, descriptor) { return makeRouteMeta(target, key, descriptor, 'get', url); };
};
exports.Get = function (url) { return makeRoute('get', url); };
exports.Post = function (url) { return makeRoute('post', url); };
exports.Put = function (url) { return makeRoute('put', url); };
exports.Delete = function (url) { return makeRoute('delete', url); };
exports.Options = function (url) { return makeRoute('options', url); };
//# sourceMappingURL=route.js.map