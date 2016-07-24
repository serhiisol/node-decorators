"use strict";
var express_1 = require('express');
var express = require('express');
var interface_1 = require('./interface');
function getParam(source, paramType, name) {
    var param = source[paramType];
    return param[name] || param;
}
function extractParameters(req, res, params) {
    var args = [];
    for (var _i = 0, params_1 = params; _i < params_1.length; _i++) {
        var item = params_1[_i];
        switch (item.type) {
            case interface_1.ParameterType.RESPONSE:
                args[item.index] = res;
                break;
            case interface_1.ParameterType.REQUEST:
                args[item.index] = req;
                break;
            case interface_1.ParameterType.PARAMS:
                args[item.index] = getParam(req, 'params', item.name);
                break;
            case interface_1.ParameterType.QUERY:
                args[item.index] = getParam(req, 'query', item.name);
                break;
            case interface_1.ParameterType.BODY:
                args[item.index] = getParam(req, 'body', item.name);
                break;
            case interface_1.ParameterType.HEADERS:
                args[item.index] = getParam(req, 'headers', item.name);
                break;
            case interface_1.ParameterType.COOKIES:
                args[item.index] = getParam(req, 'cookies', item.name);
                break;
        }
    }
    return args;
}
function registerController(app, Controller) {
    var controller = new Controller(), router = express_1.Router(), routes = controller.__meta__.routes, middleware = controller.__meta__.middleware, baseUrl = controller.__meta__.baseUrl, params = controller.__meta__.params;
    var _loop_1 = function(methodName) {
        var method = routes[methodName].method, fn = void 0;
        fn = function (req, res) {
            var args = extractParameters(req, res, params[methodName]);
            return controller[methodName].apply(controller, args);
        };
        router[method].apply(router, [
            routes[methodName].url
        ].concat((middleware[methodName] || []), [
            fn
        ]));
    };
    for (var methodName in routes) {
        _loop_1(methodName);
    }
    app.use(baseUrl, router);
    return app;
}
function bootstrapExpress(app) {
    app['controller'] = function (Controller) { return registerController(app, Controller); };
    return app;
}
exports.bootstrapExpress = bootstrapExpress;
;
/**
 * @deprecated Use bootstrapExpress
 */
exports.decorateExpressApp = bootstrapExpress;
/**
 * @deprecated Use bootstrapExpress
 */
exports.App = function () {
    var app = express();
    app.controller = function (Controller) { return registerController(app, Controller); };
    return app;
};
//# sourceMappingURL=express.js.map