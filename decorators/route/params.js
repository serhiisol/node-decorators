"use strict";
var utils_1 = require('../utils');
function addMethodConfiguration(target, methodName, config) {
    var meta = utils_1.getMeta(target);
    if (!meta.params[methodName]) {
        meta.params[methodName] = [];
    }
    meta.params[methodName].push(config);
}
exports.addMethodConfiguration = addMethodConfiguration;
function parameterDecoratorFactory(parameterType) {
    return function () {
        return function (target, methodName, index) {
            addMethodConfiguration(target, methodName, { index: index, type: parameterType });
        };
    };
}
exports.parameterDecoratorFactory = parameterDecoratorFactory;
exports.Request = function () { return function (target, methodName, index) {
    addMethodConfiguration(target, methodName, { index: index, type: 'request' });
}; };
exports.Response = function () { return function (target, methodName, index) {
    addMethodConfiguration(target, methodName, { index: index, type: 'response' });
}; };
exports.Params = function () {
};
exports.Param = function (name) {
};
exports.QueryParams = function () {
};
exports.QueryParam = function (name) {
};
exports.Body = function () {
};
exports.BodyParam = function (name) {
};
exports.Headers = function () {
};
exports.HeaderParam = function (name) {
};
exports.Cookies = function () {
};
exports.CookieParam = function (name) {
};
//# sourceMappingURL=params.js.map