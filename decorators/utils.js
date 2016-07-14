"use strict";
function ensureMeta(target) {
    if (!target.__meta__) {
        target.__meta__ = {
            baseUrl: '',
            routes: {},
            middleware: {},
            params: {}
        };
    }
}
function getMeta(target) {
    ensureMeta(target);
    return target.__meta__;
}
exports.getMeta = getMeta;
//# sourceMappingURL=utils.js.map