"use strict";
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
exports.createSchool = createSchool;
exports.inviteSchoolAdmin = inviteSchoolAdmin;
exports.createClass = createClass;
exports.inviteToSchool = inviteToSchool;
exports.getSchool = getSchool;
var prisma_1 = require("../prisma");
var ApiError_1 = require("../errors/ApiError");
var crypto_1 = require("../utils/crypto");
var mailer_1 = require("../utils/mailer");
var client_1 = require("@prisma/client");
function createSchool(name, createdByUserId) {
    return __awaiter(this, void 0, void 0, function () {
        var school;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, prisma_1.default.school.create({
                        data: { name: name },
                    })];
                case 1:
                    school = _a.sent();
                    return [2 /*return*/, school];
            }
        });
    });
}
function inviteSchoolAdmin(schoolId, email, expiresInHours, createdByUserId) {
    return __awaiter(this, void 0, void 0, function () {
        var school, token, tokenHash, expiresAt, invite, inviteUrl;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, prisma_1.default.school.findUnique({ where: { id: schoolId } })];
                case 1:
                    school = _a.sent();
                    if (!school) {
                        throw ApiError_1.ApiError.notFound('School not found');
                    }
                    token = (0, crypto_1.generateToken)();
                    tokenHash = (0, crypto_1.hashToken)(token);
                    expiresAt = new Date(Date.now() + expiresInHours * 60 * 60 * 1000);
                    return [4 /*yield*/, prisma_1.default.inviteToken.create({
                            data: {
                                tokenHash: tokenHash,
                                email: email,
                                schoolId: schoolId,
                                intendedRole: client_1.InviteRole.SCHOOL_ADMIN,
                                expiresAt: expiresAt,
                                createdByUserId: createdByUserId,
                            },
                        })];
                case 2:
                    invite = _a.sent();
                    inviteUrl = (0, mailer_1.buildInviteUrl)(token);
                    return [4 /*yield*/, (0, mailer_1.sendInviteEmail)({
                            to: email,
                            inviteUrl: inviteUrl,
                            role: 'School Administrator',
                        })];
                case 3:
                    _a.sent();
                    return [2 /*return*/, { inviteUrl: inviteUrl, expiresAt: expiresAt }];
            }
        });
    });
}
function createClass(schoolId, name) {
    return __awaiter(this, void 0, void 0, function () {
        var school, classObj;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, prisma_1.default.school.findUnique({ where: { id: schoolId } })];
                case 1:
                    school = _a.sent();
                    if (!school) {
                        throw ApiError_1.ApiError.notFound('School not found');
                    }
                    return [4 /*yield*/, prisma_1.default.class.create({
                            data: {
                                schoolId: schoolId,
                                name: name,
                            },
                        })];
                case 2:
                    classObj = _a.sent();
                    return [2 /*return*/, classObj];
            }
        });
    });
}
function inviteToSchool(schoolId, email, role, classId, expiresInHours, createdByUserId) {
    return __awaiter(this, void 0, void 0, function () {
        var school, classObj, token, tokenHash, expiresAt, invite, inviteUrl;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, prisma_1.default.school.findUnique({ where: { id: schoolId } })];
                case 1:
                    school = _a.sent();
                    if (!school) {
                        throw ApiError_1.ApiError.notFound('School not found');
                    }
                    if (!classId) return [3 /*break*/, 3];
                    return [4 /*yield*/, prisma_1.default.class.findUnique({
                            where: { id: classId },
                        })];
                case 2:
                    classObj = _a.sent();
                    if (!classObj || classObj.schoolId !== schoolId) {
                        throw ApiError_1.ApiError.notFound('Class not found or does not belong to this school');
                    }
                    _a.label = 3;
                case 3:
                    token = (0, crypto_1.generateToken)();
                    tokenHash = (0, crypto_1.hashToken)(token);
                    expiresAt = new Date(Date.now() + expiresInHours * 60 * 60 * 1000);
                    return [4 /*yield*/, prisma_1.default.inviteToken.create({
                            data: {
                                tokenHash: tokenHash,
                                email: email,
                                schoolId: schoolId,
                                classId: classId,
                                intendedRole: role,
                                expiresAt: expiresAt,
                                createdByUserId: createdByUserId,
                            },
                        })];
                case 4:
                    invite = _a.sent();
                    inviteUrl = (0, mailer_1.buildInviteUrl)(token);
                    return [4 /*yield*/, (0, mailer_1.sendInviteEmail)({
                            to: email,
                            inviteUrl: inviteUrl,
                            role: role === client_1.InviteRole.TEACHER ? 'Teacher' : 'Student',
                        })];
                case 5:
                    _a.sent();
                    return [2 /*return*/, { inviteUrl: inviteUrl, expiresAt: expiresAt }];
            }
        });
    });
}
function getSchool(schoolId) {
    return __awaiter(this, void 0, void 0, function () {
        var school;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, prisma_1.default.school.findUnique({
                        where: { id: schoolId },
                        include: {
                            classes: true,
                            memberships: {
                                include: {
                                    user: {
                                        select: {
                                            id: true,
                                            email: true,
                                            name: true,
                                        },
                                    },
                                },
                            },
                        },
                    })];
                case 1:
                    school = _a.sent();
                    if (!school) {
                        throw ApiError_1.ApiError.notFound('School not found');
                    }
                    return [2 /*return*/, school];
            }
        });
    });
}
