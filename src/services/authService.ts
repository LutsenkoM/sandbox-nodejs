import * as bcrypt from 'bcrypt';
import prisma from '../prisma';
import { ApiError } from '../errors/ApiError';
import { signToken } from '../utils/jwt';
import { hashToken } from '../utils/crypto';
import { env } from '../config/env';
import { GlobalRole, SchoolRole, ClassRole, InviteRole } from '@prisma/client';

export async function login(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || !user.passwordHash) {
    throw ApiError.unauthorized('Invalid credentials');
  }

  const isValid = await bcrypt.compare(password, user.passwordHash);
  if (!isValid) {
    throw ApiError.unauthorized('Invalid credentials');
  }

  const accessToken = signToken(user.id, user.email);

  return { accessToken };
}

export async function getMe(userId: string) {
  const user = await prisma.user.findUnique({
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
  });

  if (!user) {
    throw ApiError.notFound('User not found');
  }

  return user;
}

export async function acceptInvite(
  token: string,
  password?: string,
  name?: string
) {
  const tokenHash = hashToken(token);

  const invite = await prisma.inviteToken.findUnique({
    where: { tokenHash },
  });

  if (!invite) {
    throw ApiError.badRequest('Invalid invite token');
  }

  if (invite.usedAt) {
    throw ApiError.badRequest('Invite token already used');
  }

  if (new Date() > invite.expiresAt) {
    throw ApiError.badRequest('Invite token expired');
  }

  // Check if user exists
  let user = await prisma.user.findUnique({
    where: { email: invite.email },
  });

  if (user) {
    // User exists
    if (user.passwordHash && password) {
      // User has password and trying to set another - not allowed in this flow
      throw ApiError.badRequest('User already has a password. Please login first.');
    }

    if (!user.passwordHash && !password) {
      throw ApiError.badRequest('Password required for existing user without password');
    }

    if (!user.passwordHash && password) {
      // Set password for existing user
      const passwordHash = await bcrypt.hash(password, parseInt(env.BCRYPT_ROUNDS));
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          passwordHash,
          ...(name && { name }),
        },
      });
    }
  } else {
    // Create new user
    if (!password) {
      throw ApiError.badRequest('Password required for new user');
    }

    const passwordHash = await bcrypt.hash(password, parseInt(env.BCRYPT_ROUNDS));
    user = await prisma.user.create({
      data: {
        email: invite.email,
        passwordHash,
        name,
        globalRole: invite.intendedRole === InviteRole.SUPER_ADMIN
          ? GlobalRole.SUPER_ADMIN
          : GlobalRole.USER,
      },
    });
  }

  // Handle role assignment based on intendedRole
  switch (invite.intendedRole) {
    case InviteRole.SUPER_ADMIN:
      // Already set globalRole during user creation
      if (user.globalRole !== GlobalRole.SUPER_ADMIN) {
        await prisma.user.update({
          where: { id: user.id },
          data: { globalRole: GlobalRole.SUPER_ADMIN },
        });
      }
      break;

    case InviteRole.SCHOOL_ADMIN:
      if (!invite.schoolId) {
        throw ApiError.internal('School ID required for school admin invite');
      }
      await prisma.membership.upsert({
        where: {
          userId_schoolId: {
            userId: user.id,
            schoolId: invite.schoolId,
          },
        },
        create: {
          userId: user.id,
          schoolId: invite.schoolId,
          roleInSchool: SchoolRole.SCHOOL_ADMIN,
        },
        update: {
          roleInSchool: SchoolRole.SCHOOL_ADMIN,
        },
      });
      break;

    case InviteRole.TEACHER:
      if (!invite.schoolId) {
        throw ApiError.internal('School ID required for teacher invite');
      }
      await prisma.membership.upsert({
        where: {
          userId_schoolId: {
            userId: user.id,
            schoolId: invite.schoolId,
          },
        },
        create: {
          userId: user.id,
          schoolId: invite.schoolId,
          roleInSchool: SchoolRole.TEACHER,
        },
        update: {},
      });

      if (invite.classId) {
        await prisma.classEnrollment.upsert({
          where: {
            userId_classId: {
              userId: user.id,
              classId: invite.classId,
            },
          },
          create: {
            userId: user.id,
            classId: invite.classId,
            roleInClass: ClassRole.TEACHER,
          },
          update: {},
        });
      }
      break;

    case InviteRole.STUDENT:
      if (!invite.schoolId) {
        throw ApiError.internal('School ID required for student invite');
      }
      await prisma.membership.upsert({
        where: {
          userId_schoolId: {
            userId: user.id,
            schoolId: invite.schoolId,
          },
        },
        create: {
          userId: user.id,
          schoolId: invite.schoolId,
          roleInSchool: SchoolRole.STUDENT,
        },
        update: {},
      });

      if (invite.classId) {
        await prisma.classEnrollment.upsert({
          where: {
            userId_classId: {
              userId: user.id,
              classId: invite.classId,
            },
          },
          create: {
            userId: user.id,
            classId: invite.classId,
            roleInClass: ClassRole.STUDENT,
          },
          update: {},
        });
      }
      break;
  }

  // Mark invite as used
  await prisma.inviteToken.update({
    where: { id: invite.id },
    data: { usedAt: new Date() },
  });

  return { ok: true };
}


