"use strict";
var utils_1 = require('../../utils');
exports.Model = function (name) {
    return function (target) {
        utils_1.getMongooseMeta(target.prototype).name = name;
    };
};
//# sourceMappingURL=model.js.map