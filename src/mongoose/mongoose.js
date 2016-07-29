"use strict";
var mongoose_1 = require('mongoose');
var utils_1 = require('../utils');
var blacklist = ['length', 'name', 'prototype', '__meta__', 'constructor'];
function removeBlacklisted(keys) {
    return keys.filter(function (item) {
        return blacklist.indexOf(item) === -1;
    });
}
function bootstrapMongoose(MongooseModel) {
    var meta = utils_1.getMongooseMeta(MongooseModel.prototype), schema = new mongoose_1.Schema(meta.schema), model = MongooseModel.prototype, staticKeys = removeBlacklisted(Object.getOwnPropertyNames(MongooseModel)), instanceKeys = removeBlacklisted(Object.getOwnPropertyNames(model));
    for (var _i = 0, staticKeys_1 = staticKeys; _i < staticKeys_1.length; _i++) {
        var key = staticKeys_1[_i];
        if (typeof MongooseModel[key] === 'function') {
            schema.statics[key] = MongooseModel[key];
        }
    }
    for (var _a = 0, instanceKeys_1 = instanceKeys; _a < instanceKeys_1.length; _a++) {
        var key = instanceKeys_1[_a];
        if (typeof model[key] === 'function') {
            schema.methods[key] = model[key];
        }
    }
    model = mongoose_1.model(meta.name, schema);
    for (var _b = 0, staticKeys_2 = staticKeys; _b < staticKeys_2.length; _b++) {
        var key = staticKeys_2[_b];
        if (typeof MongooseModel[key] !== 'function') {
            model[key] = MongooseModel[key];
        }
    }
    return model;
}
exports.bootstrapMongoose = bootstrapMongoose;
//# sourceMappingURL=mongoose.js.map