import { Request, Response, NextFunction } from 'express';
import * as authService from '../services/authService';
import { checkRateLimit, resetRateLimit } from '../utils/rateLimiter';
import { ApiError } from '../errors/ApiError';

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body;

    // Rate limiting: 5 attempts per 15 minutes per IP
    const clientIp = req.ip || 'unknown';
    const rateLimitKey = `login:${clientIp}`;

    if (!checkRateLimit(rateLimitKey, 5, 15 * 60 * 1000)) {
      throw ApiError.badRequest('Too many login attempts. Please try again later.');
    }

    const result = await authService.login(email, password);

    // Reset rate limit on successful login
    resetRateLimit(rateLimitKey);

    res.json(result);
  } catch (error) {
    next(error);
  }
}

export async function me(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      throw ApiError.unauthorized();
    }

    const user = await authService.getMe(req.user.id);
    res.json(user);
  } catch (error) {
    next(error);
  }
}

export async function acceptInvite(req: Request, res: Response, next: NextFunction) {
  try {
    const { token, password, name } = req.body;

    const result = await authService.acceptInvite(token, password, name);
    res.json(result);
  } catch (error) {
    next(error);
  }
}

export async function logout(_req: Request, res: Response, _next: NextFunction) {
  // No-op for JWT (client should discard token)
  res.json({ ok: true });
}
