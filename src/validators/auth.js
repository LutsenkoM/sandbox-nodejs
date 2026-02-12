"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.acceptInviteSchema = exports.loginSchema = void 0;
var zod_1 = require("zod");
exports.loginSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string().email(),
        password: zod_1.z.string().min(6),
    }),
});
exports.acceptInviteSchema = zod_1.z.object({
    body: zod_1.z.object({
        token: zod_1.z.string().min(1),
        password: zod_1.z.string().min(6).optional(),
        name: zod_1.z.string().optional(),
    }),
});
