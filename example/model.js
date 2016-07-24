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
var mongoose_1 = require('mongoose');
var index_1 = require('../index');
mongoose_1.connect('192.168.99.100:27017/test', {
    "server": {
        "socketOptions": {
            "keepAlive": 1
        }
    }
});
var TestModelClass = (function () {
    function TestModelClass() {
    }
    TestModelClass.testMethod = function () {
        console.log('static test method');
    };
    TestModelClass.prototype.instanceMethod = function () {
        console.log(this);
    };
    TestModelClass = __decorate([
        index_1.Schema({
            testField: String
        }),
        index_1.Model('Test'), 
        __metadata('design:paramtypes', [])
    ], TestModelClass);
    return TestModelClass;
}());
exports.TestModel = index_1.bootstrapMongoose(TestModelClass);
//# sourceMappingURL=model.js.map