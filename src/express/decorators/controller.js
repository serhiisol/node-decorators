"use strict";
var utils_1 = require('../../utils');
exports.Controller = function (baseUrl) {
    return function (target) {
        var meta = utils_1.getExpressMeta(target.prototype);
        meta.baseUrl = baseUrl;
    };
};
//# sourceMappingURL=controller.js.map