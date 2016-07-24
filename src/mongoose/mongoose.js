"use strict";
var mongoose_1 = require('mongoose');
var utils_1 = require('../utils');
function bootstrapMongoose(MongooseModel) {
    var meta = utils_1.getMongooseMeta(MongooseModel.prototype), schema = new mongoose_1.Schema(meta.schema), model = MongooseModel.prototype;
    for (var key in MongooseModel) {
        if (MongooseModel.hasOwnProperty(key)) {
            schema.statics[key] = MongooseModel[key];
        }
    }
    for (var key in model) {
        if (model.hasOwnProperty(key)) {
            schema.methods[key] = model[key];
        }
    }
    return mongoose_1.model(meta.name, schema);
}
exports.bootstrapMongoose = bootstrapMongoose;
//# sourceMappingURL=mongoose.js.map