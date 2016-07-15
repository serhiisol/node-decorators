"use strict";
var utils_1 = require('../utils');
exports.Middleware = function (middleware) {
    return function (target, propertyKey, descriptor) {
        var meta = utils_1.getMeta(target);
        if (!meta.middleware[propertyKey]) {
            meta.middleware[propertyKey] = [];
        }
        meta.middleware[propertyKey].push(middleware);
        return descriptor;
    };
};
//# sourceMappingURL=middleware.js.map