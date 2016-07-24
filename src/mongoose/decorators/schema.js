"use strict";
var utils_1 = require('../../utils');
exports.Schema = function (schema) {
    return function (target) {
        utils_1.getMongooseMeta(target.prototype).schema = schema;
    };
};
//# sourceMappingURL=schema.js.map