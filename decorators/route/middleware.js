"use strict";
var utils_1 = require('../utils');
exports.Middleware = function (middle) { return function (target, key, descriptor) {
    var meta = utils_1.getMeta(target);
    if (!meta.middleware[key]) {
        meta.middleware[key] = [];
    }
    meta.middleware[key].push(middle);
    return descriptor;
}; };
//# sourceMappingURL=middleware.js.map