import { Router } from 'express';
import * as schoolController from '../controllers/schoolController';
import { validate } from '../middlewares/validate';
import { requireAuth, requireSuperAdmin, requireSchoolAdmin } from '../middlewares/auth';
import {
  createSchoolSchema,
  inviteSchoolAdminSchema,
  createClassSchema,
  inviteToSchoolSchema,
} from '../validators/school';

const router = Router();

/**
 * @openapi
 * /schools:
 *   get:
 *     tags:
 *       - Super Admin
 *     summary: Отримати список всіх шкіл
 *     description: Тільки Super Admin може переглядати всі школи
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Список всіх шкіл
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 allOf:
 *                   - $ref: '#/components/schemas/School'
 *                   - type: object
 *                     properties:
 *                       classes:
 *                         type: array
 *                         items:
 *                           $ref: '#/components/schemas/Class'
 *                       memberships:
 *                         type: array
 *                       _count:
 *                         type: object
 *       401:
 *         description: Не авторизований
 *       403:
 *         description: Доступ заборонено
 */
router.get(
  '/schools',
  requireAuth,
  requireSuperAdmin,
  schoolController.getAllSchools
);

/**
 * @openapi
 * /schools:
 *   post:
 *     tags:
 *       - Super Admin
 *     summary: Створити нову школу
 *     description: Тільки Super Admin може створювати школи
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateSchoolRequest'
 *     responses:
 *       201:
 *         description: Школу створено
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/School'
 *       401:
 *         description: Не авторизований
 *       403:
 *         description: Доступ заборонено (не Super Admin)
 */
router.post(
  '/schools',
  requireAuth,
  requireSuperAdmin,
  validate(createSchoolSchema),
  schoolController.createSchool
);

/**
 * @openapi
 * /schools/{schoolId}/invites/school-admin:
 *   post:
 *     tags:
 *       - Super Admin
 *     summary: Запросити School Admin
 *     description: Тільки Super Admin може запрошувати адміністраторів шкіл
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: schoolId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID школи
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/InviteSchoolAdminRequest'
 *     responses:
 *       201:
 *         description: Запрошення відправлено
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InviteResponse'
 *       401:
 *         description: Не авторизований
 *       403:
 *         description: Доступ заборонено
 *       404:
 *         description: Школу не знайдено
 */
router.post(
  '/schools/:schoolId/invites/school-admin',
  requireAuth,
  requireSuperAdmin,
  validate(inviteSchoolAdminSchema),
  schoolController.inviteSchoolAdmin
);

/**
 * @openapi
 * /schools/{schoolId}/classes:
 *   post:
 *     tags:
 *       - School Admin
 *     summary: Створити клас в школі
 *     description: School Admin може створювати класи у своїй школі
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: schoolId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID школи
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateClassRequest'
 *     responses:
 *       201:
 *         description: Клас створено
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Class'
 *       401:
 *         description: Не авторизований
 *       403:
 *         description: Доступ заборонено
 *       404:
 *         description: Школу не знайдено
 */
router.post(
  '/schools/:schoolId/classes',
  requireAuth,
  (req, res, next) => requireSchoolAdmin(req.params.schoolId)(req, res, next),
  validate(createClassSchema),
  schoolController.createClass
);

/**
 * @openapi
 * /schools/{schoolId}/invites:
 *   post:
 *     tags:
 *       - School Admin
 *     summary: Запросити вчителя або студента
 *     description: School Admin може запрошувати вчителів та студентів у свою школу
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: schoolId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID школи
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/InviteToSchoolRequest'
 *     responses:
 *       201:
 *         description: Запрошення відправлено
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InviteResponse'
 *       401:
 *         description: Не авторизований
 *       403:
 *         description: Доступ заборонено
 *       404:
 *         description: Школу або клас не знайдено
 */
router.post(
  '/schools/:schoolId/invites',
  requireAuth,
  (req, res, next) => requireSchoolAdmin(req.params.schoolId)(req, res, next),
  validate(inviteToSchoolSchema),
  schoolController.inviteToSchool
);

/**
 * @openapi
 * /schools/{schoolId}:
 *   get:
 *     tags:
 *       - School Admin
 *     summary: Отримати деталі школи
 *     description: School Admin або Super Admin можуть переглядати деталі школи
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: schoolId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID школи
 *     responses:
 *       200:
 *         description: Деталі школи
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/School'
 *                 - type: object
 *                   properties:
 *                     classes:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Class'
 *                     memberships:
 *                       type: array
 *                       items:
 *                         type: object
 *       401:
 *         description: Не авторизований
 *       403:
 *         description: Доступ заборонено
 *       404:
 *         description: Школу не знайдено
 */
router.get(
  '/schools/:schoolId',
  requireAuth,
  (req, res, next) => requireSchoolAdmin(req.params.schoolId)(req, res, next),
  schoolController.getSchool
);

/**
 * @openapi
 * /schools/{schoolId}/classes:
 *   get:
 *     tags:
 *       - School Admin
 *     summary: Отримати список всіх класів школи
 *     description: School Admin або Super Admin можуть переглядати класи школи
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: schoolId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID школи
 *     responses:
 *       200:
 *         description: Список класів
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 allOf:
 *                   - $ref: '#/components/schemas/Class'
 *                   - type: object
 *                     properties:
 *                       enrollments:
 *                         type: array
 *                       _count:
 *                         type: object
 *       401:
 *         description: Не авторизований
 *       403:
 *         description: Доступ заборонено
 *       404:
 *         description: Школу не знайдено
 */
router.get(
  '/schools/:schoolId/classes',
  requireAuth,
  (req, res, next) => requireSchoolAdmin(req.params.schoolId)(req, res, next),
  schoolController.getSchoolClasses
);

export default router;
