"use strict";
var mongoose_1 = require('mongoose');
var utils_1 = require('../utils');
function bootstrapMongoose(MongooseModel) {
    var meta = utils_1.getMongooseMeta(MongooseModel.prototype), schema = new mongoose_1.Schema(meta.schema), model = MongooseModel.prototype;
    for (var _i = 0, _a = Object.getOwnPropertyNames(MongooseModel); _i < _a.length; _i++) {
        var key = _a[_i];
        if (typeof MongooseModel[key] === 'function') {
            schema.statics[key] = MongooseModel[key];
        }
    }
    var modelKeys = Object.getOwnPropertyNames(model), index = modelKeys.indexOf('constructor');
    modelKeys.splice(index, 1);
    index = modelKeys.indexOf('__meta__');
    modelKeys.splice(index, 1);
    for (var _b = 0, modelKeys_1 = modelKeys; _b < modelKeys_1.length; _b++) {
        var key = modelKeys_1[_b];
        if (typeof model[key] === 'function') {
            schema.methods[key] = model[key];
        }
    }
    return mongoose_1.model(meta.name, schema);
}
exports.bootstrapMongoose = bootstrapMongoose;
//# sourceMappingURL=mongoose.js.map