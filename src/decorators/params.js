"use strict";
var utils_1 = require('../utils');
var interface_1 = require('../interface');
function addParameterConfiguration(target, propertyKey, config) {
    var meta = utils_1.getMeta(target);
    if (!meta.params[propertyKey]) {
        meta.params[propertyKey] = [];
    }
    meta.params[propertyKey].push(config);
}
function parameterDecoratorFactory(parameterType) {
    return function (name) {
        return function (target, propertyKey, index) {
            addParameterConfiguration(target, propertyKey, { index: index, type: parameterType, name: name });
        };
    };
}
exports.Request = parameterDecoratorFactory(interface_1.ParameterType.REQUEST);
exports.Response = parameterDecoratorFactory(interface_1.ParameterType.RESPONSE);
exports.Params = parameterDecoratorFactory(interface_1.ParameterType.PARAMS);
exports.Query = parameterDecoratorFactory(interface_1.ParameterType.QUERY);
exports.Body = parameterDecoratorFactory(interface_1.ParameterType.BODY);
exports.Headers = parameterDecoratorFactory(interface_1.ParameterType.HEADERS);
exports.Cookies = parameterDecoratorFactory(interface_1.ParameterType.COOKIES);
//# sourceMappingURL=params.js.map