"use strict";
function getExpressMeta(target) {
    if (!target.__meta__) {
        target.__meta__ = {
            baseUrl: '',
            routes: {},
            middleware: {},
            params: {}
        };
    }
    return target.__meta__;
}
exports.getExpressMeta = getExpressMeta;
function getMongooseMeta(target) {
    if (!target.__meta__) {
        target.__meta__ = {
            schema: {},
            name: ''
        };
    }
    return target.__meta__;
}
exports.getMongooseMeta = getMongooseMeta;
//# sourceMappingURL=utils.js.map