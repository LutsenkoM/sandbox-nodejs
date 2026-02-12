"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMessageSchema = void 0;
var zod_1 = require("zod");
exports.createMessageSchema = zod_1.z.object({
    body: zod_1.z.object({
        text: zod_1.z.string().min(1).max(5000),
    }),
});
