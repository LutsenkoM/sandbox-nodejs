import { Router } from 'express';
import * as authController from '../controllers/authController';
import { validate } from '../middlewares/validate';
import { requireAuth } from '../middlewares/auth';
import { loginSchema, acceptInviteSchema } from '../validators/auth';

const router = Router();

/**
 * @openapi
 * /auth/login:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Login з email та паролем
 *     description: Авторизація користувача та отримання JWT токену
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Успішний login
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       401:
 *         description: Невірні credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       400:
 *         description: Забагато спроб входу
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/auth/login', validate(loginSchema), authController.login);

/**
 * @openapi
 * /auth/me:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Отримати інформацію про поточного користувача
 *     description: Повертає дані користувача з його membership та enrollments
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Інформація про користувача
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Не авторизований
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/auth/me', requireAuth, authController.me);

/**
 * @openapi
 * /auth/accept-invite:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Прийняти запрошення
 *     description: Прийняти invite токен і створити/оновити акаунт з паролем
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AcceptInviteRequest'
 *     responses:
 *       200:
 *         description: Запрошення успішно прийняте
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                   example: true
 *       400:
 *         description: Невірний або прострочений токен
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/auth/accept-invite', validate(acceptInviteSchema), authController.acceptInvite);

/**
 * @openapi
 * /auth/logout:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Logout
 *     description: No-op для JWT (клієнт видаляє токен)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Успішний logout
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                   example: true
 */
router.post('/auth/logout', requireAuth, authController.logout);

export default router;
