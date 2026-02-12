"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
var ApiError_1 = require("./ApiError");
var zod_1 = require("zod");
var env_1 = require("../config/env");
function errorHandler(err, req, res, next) {
    if (res.headersSent) {
        return next(err);
    }
    // Handle Zod validation errors
    if (err instanceof zod_1.ZodError) {
        return res.status(400).json({
            error: {
                code: 'VALIDATION_ERROR',
                message: 'Invalid request data',
                details: err.errors,
            },
        });
    }
    // Handle ApiError
    if (err instanceof ApiError_1.ApiError) {
        return res.status(err.statusCode).json({
            error: __assign({ code: err.code, message: err.message }, (err.details && { details: err.details })),
        });
    }
    // Log unexpected errors
    console.error('Unexpected error:', err);
    // Handle unknown errors
    return res.status(500).json({
        error: {
            code: 'INTERNAL_ERROR',
            message: env_1.env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
        },
    });
}
