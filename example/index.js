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
var express = require('express');
var index_1 = require('../index');
var model_1 = require('./model');
var TestController = (function () {
    function TestController() {
    }
    TestController.prototype.getData = function (res, id) {
        var test = new model_1.TestModel();
        test.testField = "Hello World";
        model_1.TestModel.testMethod();
        test.instanceMethod();
        test.save(function () { return res.send('balalala ' + JSON.stringify(id)); });
    };
    __decorate([
        index_1.Get('/all/:id'),
        index_1.Middleware(function (req, res, next) {
            console.log('Hello World');
            next();
        }),
        __param(0, index_1.Response()),
        __param(1, index_1.Params('id')), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', [Object, String]), 
        __metadata('design:returntype', void 0)
    ], TestController.prototype, "getData", null);
    TestController = __decorate([
        index_1.Controller('/'), 
        __metadata('design:paramtypes', [])
    ], TestController);
    return TestController;
}());
var app = express();
index_1.bootstrapExpress(app);
app.controller(TestController).listen(3003);
//# sourceMappingURL=index.js.map