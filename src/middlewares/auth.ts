import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import { ApiError } from '../errors/ApiError';
import prisma from '../prisma';
import { GlobalRole, SchoolRole, ClassRole } from '@prisma/client';

export interface AuthUser {
  id: string;
  email: string;
  globalRole: GlobalRole;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export async function requireAuth(req: Request, _res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw ApiError.unauthorized('Missing or invalid authorization header');
    }

    const token = authHeader.substring(7);
    const payload = verifyToken(token);

    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      select: { id: true, email: true, globalRole: true },
    });

    if (!user) {
      throw ApiError.unauthorized('User not found');
    }

    req.user = user;
    next();
  } catch (error) {
    if (error instanceof ApiError) {
      next(error);
    } else {
      next(ApiError.unauthorized('Invalid token'));
    }
  }
}

export function requireSuperAdmin(req: Request, _res: Response, next: NextFunction) {
  if (!req.user) {
    return next(ApiError.unauthorized());
  }

  if (req.user.globalRole !== GlobalRole.SUPER_ADMIN) {
    return next(ApiError.forbidden('Super admin access required'));
  }

  next();
}

export function requireSchoolAdmin(schoolId: string) {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw ApiError.unauthorized();
      }

      // Super admin has access to everything
      if (req.user.globalRole === GlobalRole.SUPER_ADMIN) {
        return next();
      }

      const membership = await prisma.membership.findUnique({
        where: {
          userId_schoolId: {
            userId: req.user.id,
            schoolId,
          },
        },
      });

      if (!membership || membership.roleInSchool !== SchoolRole.SCHOOL_ADMIN) {
        throw ApiError.forbidden('School admin access required');
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}

export function requireTeacherInClass(classId: string) {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw ApiError.unauthorized();
      }

      const enrollment = await prisma.classEnrollment.findUnique({
        where: {
          userId_classId: {
            userId: req.user.id,
            classId,
          },
        },
      });

      if (!enrollment || enrollment.roleInClass !== ClassRole.TEACHER) {
        throw ApiError.forbidden('Teacher access required for this class');
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}

export function requireMemberInClass(classId: string) {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw ApiError.unauthorized();
      }

      const enrollment = await prisma.classEnrollment.findUnique({
        where: {
          userId_classId: {
            userId: req.user.id,
            classId,
          },
        },
      });

      if (!enrollment) {
        throw ApiError.forbidden('Class membership required');
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}
