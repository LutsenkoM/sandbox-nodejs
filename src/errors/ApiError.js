"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiError = void 0;
var ApiError = /** @class */ (function (_super) {
    __extends(ApiError, _super);
    function ApiError(statusCode, code, message, details) {
        var _this = _super.call(this, message) || this;
        _this.statusCode = statusCode;
        _this.code = code;
        _this.details = details;
        _this.name = 'ApiError';
        Error.captureStackTrace(_this, _this.constructor);
        return _this;
    }
    ApiError.badRequest = function (message, details) {
        return new ApiError(400, 'BAD_REQUEST', message, details);
    };
    ApiError.unauthorized = function (message) {
        if (message === void 0) { message = 'Unauthorized'; }
        return new ApiError(401, 'UNAUTHORIZED', message);
    };
    ApiError.forbidden = function (message) {
        if (message === void 0) { message = 'Forbidden'; }
        return new ApiError(403, 'FORBIDDEN', message);
    };
    ApiError.notFound = function (message) {
        if (message === void 0) { message = 'Resource not found'; }
        return new ApiError(404, 'NOT_FOUND', message);
    };
    ApiError.conflict = function (message) {
        return new ApiError(409, 'CONFLICT', message);
    };
    ApiError.internal = function (message) {
        if (message === void 0) { message = 'Internal server error'; }
        return new ApiError(500, 'INTERNAL_ERROR', message);
    };
    return ApiError;
}(Error));
exports.ApiError = ApiError;
