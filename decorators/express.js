"use strict";
var express_1 = require('express');
var express = require('express');
function compare(a, b) {
    if (a.index < b.index) {
        return -1;
    }
    else if (a.index > b.index) {
        return 1;
    }
    return 0;
}
function extractParameters(req, res, params) {
    var args = [];
    params = params.sort(compare);
    for (var _i = 0, params_1 = params; _i < params_1.length; _i++) {
        var item = params_1[_i];
        if (item.type === 'request') {
            args.push(req);
        }
        if (item.type === 'response') {
            args.push(res);
        }
        console.log(item);
    }
    return args;
}
exports.App = function () {
    var app = express();
    app['controller'] = function (Controller) {
        var controller = new Controller(), router = express_1.Router(), routes = controller.__meta__.routes, middleware = controller.__meta__.middleware, baseUrl = controller.__meta__.baseUrl, params = controller.__meta__.params;
        var _loop_1 = function(methodName) {
            var method = routes[methodName].method, fn = void 0;
            fn = function (req, res) {
                var args = extractParameters(req, res, params[methodName]);
                return controller[methodName].apply(controller, args);
            };
            router[method].apply(router, [
                routes[methodName].url
            ].concat(middleware[methodName], [
                fn
            ]));
        };
        for (var methodName in routes) {
            _loop_1(methodName);
        }
        app.use(baseUrl, router);
        return app;
    };
    return app;
};
//# sourceMappingURL=express.js.map