"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var decorators_1 = require('./decorators');
var Test = (function () {
    function Test() {
    }
    Test.prototype.getData = function (res, req) {
        res.send('balalala');
    };
    __decorate([
        decorators_1.RouteGet('/all'),
        decorators_1.Middleware(function (req, res, next) {
            console.log('Hello World');
            next();
        }),
        __param(0, decorators_1.Response()),
        __param(1, decorators_1.Request()), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', [Object, Object]), 
        __metadata('design:returntype', void 0)
    ], Test.prototype, "getData", null);
    Test = __decorate([
        decorators_1.Controller('/'), 
        __metadata('design:paramtypes', [])
    ], Test);
    return Test;
}());
var app = decorators_1.App();
app.controller(Test)
    .listen(3000);
//# sourceMappingURL=index.js.map