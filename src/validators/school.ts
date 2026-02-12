import { z } from 'zod';
import { InviteRole } from '@prisma/client';

export const createSchoolSchema = z.object({
  body: z.object({
    name: z.string().min(1).max(255),
  }),
});

export const inviteSchoolAdminSchema = z.object({
  body: z.object({
    email: z.string().email(),
    expiresInHours: z.number().positive().optional().default(72),
  }),
});

export const createClassSchema = z.object({
  body: z.object({
    name: z.string().min(1).max(255),
  }),
});

export const inviteToSchoolSchema = z.object({
  body: z.object({
    email: z.string().email(),
    role: z.enum([InviteRole.TEACHER, InviteRole.STUDENT]),
    classId: z.string().optional(),
    expiresInHours: z.number().positive().optional().default(72),
  }),
});

