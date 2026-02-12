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
exports.requireAuth = requireAuth;
exports.requireSuperAdmin = requireSuperAdmin;
exports.requireSchoolAdmin = requireSchoolAdmin;
exports.requireTeacherInClass = requireTeacherInClass;
exports.requireMemberInClass = requireMemberInClass;
var jwt_1 = require("../utils/jwt");
var ApiError_1 = require("../errors/ApiError");
var prisma_1 = require("../prisma");
var client_1 = require("@prisma/client");
function requireAuth(req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var authHeader, token, payload, user, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    authHeader = req.headers.authorization;
                    if (!authHeader || !authHeader.startsWith('Bearer ')) {
                        throw ApiError_1.ApiError.unauthorized('Missing or invalid authorization header');
                    }
                    token = authHeader.substring(7);
                    payload = (0, jwt_1.verifyToken)(token);
                    return [4 /*yield*/, prisma_1.default.user.findUnique({
                            where: { id: payload.sub },
                            select: { id: true, email: true, globalRole: true },
                        })];
                case 1:
                    user = _a.sent();
                    if (!user) {
                        throw ApiError_1.ApiError.unauthorized('User not found');
                    }
                    req.user = user;
                    next();
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _a.sent();
                    if (error_1 instanceof ApiError_1.ApiError) {
                        next(error_1);
                    }
                    else {
                        next(ApiError_1.ApiError.unauthorized('Invalid token'));
                    }
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function requireSuperAdmin(req, res, next) {
    if (!req.user) {
        return next(ApiError_1.ApiError.unauthorized());
    }
    if (req.user.globalRole !== client_1.GlobalRole.SUPER_ADMIN) {
        return next(ApiError_1.ApiError.forbidden('Super admin access required'));
    }
    next();
}
function requireSchoolAdmin(schoolId) {
    var _this = this;
    return function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
        var membership, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    if (!req.user) {
                        throw ApiError_1.ApiError.unauthorized();
                    }
                    // Super admin has access to everything
                    if (req.user.globalRole === client_1.GlobalRole.SUPER_ADMIN) {
                        return [2 /*return*/, next()];
                    }
                    return [4 /*yield*/, prisma_1.default.membership.findUnique({
                            where: {
                                userId_schoolId: {
                                    userId: req.user.id,
                                    schoolId: schoolId,
                                },
                            },
                        })];
                case 1:
                    membership = _a.sent();
                    if (!membership || membership.roleInSchool !== client_1.SchoolRole.SCHOOL_ADMIN) {
                        throw ApiError_1.ApiError.forbidden('School admin access required');
                    }
                    next();
                    return [3 /*break*/, 3];
                case 2:
                    error_2 = _a.sent();
                    next(error_2);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
}
function requireTeacherInClass(classId) {
    var _this = this;
    return function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
        var enrollment, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    if (!req.user) {
                        throw ApiError_1.ApiError.unauthorized();
                    }
                    return [4 /*yield*/, prisma_1.default.classEnrollment.findUnique({
                            where: {
                                userId_classId: {
                                    userId: req.user.id,
                                    classId: classId,
                                },
                            },
                        })];
                case 1:
                    enrollment = _a.sent();
                    if (!enrollment || enrollment.roleInClass !== client_1.ClassRole.TEACHER) {
                        throw ApiError_1.ApiError.forbidden('Teacher access required for this class');
                    }
                    next();
                    return [3 /*break*/, 3];
                case 2:
                    error_3 = _a.sent();
                    next(error_3);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
}
function requireMemberInClass(classId) {
    var _this = this;
    return function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
        var enrollment, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    if (!req.user) {
                        throw ApiError_1.ApiError.unauthorized();
                    }
                    return [4 /*yield*/, prisma_1.default.classEnrollment.findUnique({
                            where: {
                                userId_classId: {
                                    userId: req.user.id,
                                    classId: classId,
                                },
                            },
                        })];
                case 1:
                    enrollment = _a.sent();
                    if (!enrollment) {
                        throw ApiError_1.ApiError.forbidden('Class membership required');
                    }
                    next();
                    return [3 /*break*/, 3];
                case 2:
                    error_4 = _a.sent();
                    next(error_4);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
}
