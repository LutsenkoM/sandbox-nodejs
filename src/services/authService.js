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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = login;
exports.getMe = getMe;
exports.acceptInvite = acceptInvite;
var bcrypt = require("bcrypt");
var prisma_1 = require("../prisma");
var ApiError_1 = require("../errors/ApiError");
var jwt_1 = require("../utils/jwt");
var crypto_1 = require("../utils/crypto");
var env_1 = require("../config/env");
var client_1 = require("@prisma/client");
function login(email, password) {
    return __awaiter(this, void 0, void 0, function () {
        var user, isValid, accessToken;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, prisma_1.default.user.findUnique({ where: { email: email } })];
                case 1:
                    user = _a.sent();
                    if (!user || !user.passwordHash) {
                        throw ApiError_1.ApiError.unauthorized('Invalid credentials');
                    }
                    return [4 /*yield*/, bcrypt.compare(password, user.passwordHash)];
                case 2:
                    isValid = _a.sent();
                    if (!isValid) {
                        throw ApiError_1.ApiError.unauthorized('Invalid credentials');
                    }
                    accessToken = (0, jwt_1.signToken)(user.id, user.email);
                    return [2 /*return*/, { accessToken: accessToken }];
            }
        });
    });
}
function getMe(userId) {
    return __awaiter(this, void 0, void 0, function () {
        var user;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, prisma_1.default.user.findUnique({
                        where: { id: userId },
                        select: {
                            id: true,
                            email: true,
                            name: true,
                            globalRole: true,
                            createdAt: true,
                            memberships: {
                                include: {
                                    school: true,
                                },
                            },
                            classEnrollments: {
                                include: {
                                    class: {
                                        include: {
                                            school: true,
                                        },
                                    },
                                },
                            },
                        },
                    })];
                case 1:
                    user = _a.sent();
                    if (!user) {
                        throw ApiError_1.ApiError.notFound('User not found');
                    }
                    return [2 /*return*/, user];
            }
        });
    });
}
function acceptInvite(token, password, name) {
    return __awaiter(this, void 0, void 0, function () {
        var tokenHash, invite, user, passwordHash, passwordHash, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    tokenHash = (0, crypto_1.hashToken)(token);
                    return [4 /*yield*/, prisma_1.default.inviteToken.findUnique({
                            where: { tokenHash: tokenHash },
                        })];
                case 1:
                    invite = _b.sent();
                    if (!invite) {
                        throw ApiError_1.ApiError.badRequest('Invalid invite token');
                    }
                    if (invite.usedAt) {
                        throw ApiError_1.ApiError.badRequest('Invite token already used');
                    }
                    if (new Date() > invite.expiresAt) {
                        throw ApiError_1.ApiError.badRequest('Invite token expired');
                    }
                    return [4 /*yield*/, prisma_1.default.user.findUnique({
                            where: { email: invite.email },
                        })];
                case 2:
                    user = _b.sent();
                    if (!user) return [3 /*break*/, 6];
                    // User exists
                    if (user.passwordHash && password) {
                        // User has password and trying to set another - not allowed in this flow
                        throw ApiError_1.ApiError.badRequest('User already has a password. Please login first.');
                    }
                    if (!user.passwordHash && !password) {
                        throw ApiError_1.ApiError.badRequest('Password required for existing user without password');
                    }
                    if (!(!user.passwordHash && password)) return [3 /*break*/, 5];
                    return [4 /*yield*/, bcrypt.hash(password, parseInt(env_1.env.BCRYPT_ROUNDS))];
                case 3:
                    passwordHash = _b.sent();
                    return [4 /*yield*/, prisma_1.default.user.update({
                            where: { id: user.id },
                            data: __assign({ passwordHash: passwordHash }, (name && { name: name })),
                        })];
                case 4:
                    user = _b.sent();
                    _b.label = 5;
                case 5: return [3 /*break*/, 9];
                case 6:
                    // Create new user
                    if (!password) {
                        throw ApiError_1.ApiError.badRequest('Password required for new user');
                    }
                    return [4 /*yield*/, bcrypt.hash(password, parseInt(env_1.env.BCRYPT_ROUNDS))];
                case 7:
                    passwordHash = _b.sent();
                    return [4 /*yield*/, prisma_1.default.user.create({
                            data: {
                                email: invite.email,
                                passwordHash: passwordHash,
                                name: name,
                                globalRole: invite.intendedRole === client_1.InviteRole.SUPER_ADMIN
                                    ? client_1.GlobalRole.SUPER_ADMIN
                                    : client_1.GlobalRole.USER,
                            },
                        })];
                case 8:
                    user = _b.sent();
                    _b.label = 9;
                case 9:
                    _a = invite.intendedRole;
                    switch (_a) {
                        case client_1.InviteRole.SUPER_ADMIN: return [3 /*break*/, 10];
                        case client_1.InviteRole.SCHOOL_ADMIN: return [3 /*break*/, 13];
                        case client_1.InviteRole.TEACHER: return [3 /*break*/, 15];
                        case client_1.InviteRole.STUDENT: return [3 /*break*/, 19];
                    }
                    return [3 /*break*/, 23];
                case 10:
                    if (!(user.globalRole !== client_1.GlobalRole.SUPER_ADMIN)) return [3 /*break*/, 12];
                    return [4 /*yield*/, prisma_1.default.user.update({
                            where: { id: user.id },
                            data: { globalRole: client_1.GlobalRole.SUPER_ADMIN },
                        })];
                case 11:
                    _b.sent();
                    _b.label = 12;
                case 12: return [3 /*break*/, 23];
                case 13:
                    if (!invite.schoolId) {
                        throw ApiError_1.ApiError.internal('School ID required for school admin invite');
                    }
                    return [4 /*yield*/, prisma_1.default.membership.upsert({
                            where: {
                                userId_schoolId: {
                                    userId: user.id,
                                    schoolId: invite.schoolId,
                                },
                            },
                            create: {
                                userId: user.id,
                                schoolId: invite.schoolId,
                                roleInSchool: client_1.SchoolRole.SCHOOL_ADMIN,
                            },
                            update: {
                                roleInSchool: client_1.SchoolRole.SCHOOL_ADMIN,
                            },
                        })];
                case 14:
                    _b.sent();
                    return [3 /*break*/, 23];
                case 15:
                    if (!invite.schoolId) {
                        throw ApiError_1.ApiError.internal('School ID required for teacher invite');
                    }
                    return [4 /*yield*/, prisma_1.default.membership.upsert({
                            where: {
                                userId_schoolId: {
                                    userId: user.id,
                                    schoolId: invite.schoolId,
                                },
                            },
                            create: {
                                userId: user.id,
                                schoolId: invite.schoolId,
                                roleInSchool: client_1.SchoolRole.TEACHER,
                            },
                            update: {},
                        })];
                case 16:
                    _b.sent();
                    if (!invite.classId) return [3 /*break*/, 18];
                    return [4 /*yield*/, prisma_1.default.classEnrollment.upsert({
                            where: {
                                userId_classId: {
                                    userId: user.id,
                                    classId: invite.classId,
                                },
                            },
                            create: {
                                userId: user.id,
                                classId: invite.classId,
                                roleInClass: client_1.ClassRole.TEACHER,
                            },
                            update: {},
                        })];
                case 17:
                    _b.sent();
                    _b.label = 18;
                case 18: return [3 /*break*/, 23];
                case 19:
                    if (!invite.schoolId) {
                        throw ApiError_1.ApiError.internal('School ID required for student invite');
                    }
                    return [4 /*yield*/, prisma_1.default.membership.upsert({
                            where: {
                                userId_schoolId: {
                                    userId: user.id,
                                    schoolId: invite.schoolId,
                                },
                            },
                            create: {
                                userId: user.id,
                                schoolId: invite.schoolId,
                                roleInSchool: client_1.SchoolRole.STUDENT,
                            },
                            update: {},
                        })];
                case 20:
                    _b.sent();
                    if (!invite.classId) return [3 /*break*/, 22];
                    return [4 /*yield*/, prisma_1.default.classEnrollment.upsert({
                            where: {
                                userId_classId: {
                                    userId: user.id,
                                    classId: invite.classId,
                                },
                            },
                            create: {
                                userId: user.id,
                                classId: invite.classId,
                                roleInClass: client_1.ClassRole.STUDENT,
                            },
                            update: {},
                        })];
                case 21:
                    _b.sent();
                    _b.label = 22;
                case 22: return [3 /*break*/, 23];
                case 23: 
                // Mark invite as used
                return [4 /*yield*/, prisma_1.default.inviteToken.update({
                        where: { id: invite.id },
                        data: { usedAt: new Date() },
                    })];
                case 24:
                    // Mark invite as used
                    _b.sent();
                    return [2 /*return*/, { ok: true }];
            }
        });
    });
}
