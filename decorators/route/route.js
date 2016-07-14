"use strict";
var utils_1 = require('../utils');
function makeRouteMeta(target, key, descriptor, method, url) {
    var meta = utils_1.getMeta(target);
    meta.routes[key] = { method: method, url: url };
    return descriptor;
}
function makeRoute(method, url) {
    return function (target, key, descriptor) { return makeRouteMeta(target, key, descriptor, 'get', url); };
}
exports.Route = function (method, url) { return makeRoute(method, url); };
exports.RouteGet = function (url) { return makeRoute('get', url); };
exports.RoutePost = function (url) { return makeRoute('post', url); };
exports.RoutePut = function (url) { return makeRoute('put', url); };
exports.RouteDelete = function (url) { return makeRoute('delete', url); };
exports.RouteOptions = function (url) { return makeRoute('options', url); };
//# sourceMappingURL=route.js.map