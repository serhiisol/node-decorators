"use strict";
(function (ParameterType) {
    ParameterType[ParameterType["REQUEST"] = 0] = "REQUEST";
    ParameterType[ParameterType["RESPONSE"] = 1] = "RESPONSE";
    ParameterType[ParameterType["PARAMS"] = 2] = "PARAMS";
    ParameterType[ParameterType["QUERY"] = 3] = "QUERY";
    ParameterType[ParameterType["BODY"] = 4] = "BODY";
    ParameterType[ParameterType["HEADERS"] = 5] = "HEADERS";
    ParameterType[ParameterType["COOKIES"] = 6] = "COOKIES";
})(exports.ParameterType || (exports.ParameterType = {}));
var ParameterType = exports.ParameterType;
//# sourceMappingURL=interface.js.map