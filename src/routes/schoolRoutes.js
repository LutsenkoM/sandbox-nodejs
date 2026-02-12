"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var schoolController = require("../controllers/schoolController");
var validate_1 = require("../middlewares/validate");
var auth_1 = require("../middlewares/auth");
var school_1 = require("../validators/school");
var router = (0, express_1.Router)();
// Super admin only
router.post('/schools', auth_1.requireAuth, auth_1.requireSuperAdmin, (0, validate_1.validate)(school_1.createSchoolSchema), schoolController.createSchool);
router.post('/schools/:schoolId/invites/school-admin', auth_1.requireAuth, auth_1.requireSuperAdmin, (0, validate_1.validate)(school_1.inviteSchoolAdminSchema), schoolController.inviteSchoolAdmin);
// School admin routes
router.post('/schools/:schoolId/classes', auth_1.requireAuth, function (req, res, next) { return (0, auth_1.requireSchoolAdmin)(req.params.schoolId)(req, res, next); }, (0, validate_1.validate)(school_1.createClassSchema), schoolController.createClass);
router.post('/schools/:schoolId/invites', auth_1.requireAuth, function (req, res, next) { return (0, auth_1.requireSchoolAdmin)(req.params.schoolId)(req, res, next); }, (0, validate_1.validate)(school_1.inviteToSchoolSchema), schoolController.inviteToSchool);
router.get('/schools/:schoolId', auth_1.requireAuth, function (req, res, next) { return (0, auth_1.requireSchoolAdmin)(req.params.schoolId)(req, res, next); }, schoolController.getSchool);
exports.default = router;
