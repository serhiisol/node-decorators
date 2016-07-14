"use strict";
var utils_1 = require('../utils');
exports.Controller = function (baseUrl) { return function (target) {
    utils_1.getMeta(target.prototype).baseUrl = baseUrl;
}; };
//# sourceMappingURL=controller.js.map