"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inviteToSchoolSchema = exports.createClassSchema = exports.inviteSchoolAdminSchema = exports.createSchoolSchema = void 0;
var zod_1 = require("zod");
var client_1 = require("@prisma/client");
exports.createSchoolSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(1).max(255),
    }),
});
exports.inviteSchoolAdminSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string().email(),
        expiresInHours: zod_1.z.number().positive().optional().default(72),
    }),
});
exports.createClassSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(1).max(255),
    }),
});
exports.inviteToSchoolSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string().email(),
        role: zod_1.z.enum([client_1.InviteRole.TEACHER, client_1.InviteRole.STUDENT]),
        classId: zod_1.z.string().optional(),
        expiresInHours: zod_1.z.number().positive().optional().default(72),
    }),
});
