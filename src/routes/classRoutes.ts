import { Router } from 'express';
import * as classController from '../controllers/classController';
import { validate } from '../middlewares/validate';
import { requireAuth, requireTeacherInClass, requireMemberInClass } from '../middlewares/auth';
import { createMessageSchema } from '../validators/message';

const router = Router();

/**
 * @openapi
 * /classes/{classId}/messages:
 *   post:
 *     tags:
 *       - Classes
 *     summary: Відправити повідомлення в клас
 *     description: Тільки вчителі можуть відправляти повідомлення в класі
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: classId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID класу
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateMessageRequest'
 *     responses:
 *       201:
 *         description: Повідомлення створено
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Message'
 *       401:
 *         description: Не авторизований
 *       403:
 *         description: Доступ заборонено (не вчитель цього класу)
 *       404:
 *         description: Клас не знайдено
 */
router.post(
  '/classes/:classId/messages',
  requireAuth,
  (req, res, next) => requireTeacherInClass(req.params.classId)(req, res, next),
  validate(createMessageSchema),
  classController.createMessage
);

/**
 * @openapi
 * /classes/{classId}/messages:
 *   get:
 *     tags:
 *       - Classes
 *     summary: Отримати всі повідомлення класу
 *     description: Всі члени класу (вчителі та студенти) можуть переглядати повідомлення
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: classId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID класу
 *     responses:
 *       200:
 *         description: Список повідомлень
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Message'
 *       401:
 *         description: Не авторизований
 *       403:
 *         description: Доступ заборонено (не член класу)
 */
router.get(
  '/classes/:classId/messages',
  requireAuth,
  (req, res, next) => requireMemberInClass(req.params.classId)(req, res, next),
  classController.getMessages
);

/**
 * @openapi
 * /classes/{classId}:
 *   get:
 *     tags:
 *       - Classes
 *     summary: Отримати деталі класу
 *     description: Всі члени класу можуть переглядати інформацію про клас
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: classId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID класу
 *     responses:
 *       200:
 *         description: Деталі класу
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Class'
 *                 - type: object
 *                   properties:
 *                     school:
 *                       $ref: '#/components/schemas/School'
 *                     enrollments:
 *                       type: array
 *                       items:
 *                         type: object
 *       401:
 *         description: Не авторизований
 *       403:
 *         description: Доступ заборонено (не член класу)
 *       404:
 *         description: Клас не знайдено
 */
router.get(
  '/classes/:classId',
  requireAuth,
  (req, res, next) => requireMemberInClass(req.params.classId)(req, res, next),
  classController.getClass
);

/**
 * @openapi
 * /classes/{classId}/students:
 *   get:
 *     tags:
 *       - Classes
 *     summary: Отримати список всіх учнів класу
 *     description: Всі члени класу (Teacher і Student) можуть переглядати список учнів
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: classId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID класу
 *     responses:
 *       200:
 *         description: Список учнів
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   enrollmentId:
 *                     type: string
 *                   enrolledAt:
 *                     type: string
 *                     format: date-time
 *                   student:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       email:
 *                         type: string
 *                       name:
 *                         type: string
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *       401:
 *         description: Не авторизований
 *       403:
 *         description: Доступ заборонено (не член класу)
 *       404:
 *         description: Клас не знайдено
 */
router.get(
  '/classes/:classId/students',
  requireAuth,
  (req, res, next) => requireMemberInClass(req.params.classId)(req, res, next),
  classController.getClassStudents
);

export default router;
