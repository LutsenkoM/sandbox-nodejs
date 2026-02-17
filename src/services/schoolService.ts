import prisma from '../prisma';
import { ApiError } from '../errors/ApiError';
import { generateToken, hashToken } from '../utils/crypto';
import { sendInviteEmail, buildInviteUrl } from '../utils/mailer';
import { InviteRole } from '@prisma/client';

export async function createSchool(name: string, _createdByUserId: string) {
  const school = await prisma.school.create({
    data: { name },
  });

  return school;
}

export async function inviteSchoolAdmin(
  schoolId: string,
  email: string,
  expiresInHours: number,
  createdByUserId: string
) {
  // Verify school exists
  const school = await prisma.school.findUnique({ where: { id: schoolId } });
  if (!school) {
    throw ApiError.notFound('School not found');
  }

  const token = generateToken();
  const tokenHash = hashToken(token);
  const expiresAt = new Date(Date.now() + expiresInHours * 60 * 60 * 1000);

  await prisma.inviteToken.create({
    data: {
      tokenHash,
      email,
      schoolId,
      intendedRole: InviteRole.SCHOOL_ADMIN,
      expiresAt,
      createdByUserId,
    },
  });

  const inviteUrl = buildInviteUrl(token);
  await sendInviteEmail({
    to: email,
    inviteUrl,
    role: 'School Administrator',
  });

  return { inviteUrl, expiresAt };
}

export async function createClass(schoolId: string, name: string) {
  // Verify school exists
  const school = await prisma.school.findUnique({ where: { id: schoolId } });
  if (!school) {
    throw ApiError.notFound('School not found');
  }

  const classObj = await prisma.class.create({
    data: {
      schoolId,
      name,
    },
  });

  return classObj;
}

export async function inviteToSchool(
  schoolId: string,
  email: string,
  role: typeof InviteRole.TEACHER | typeof InviteRole.STUDENT,
  classId: string | undefined,
  expiresInHours: number,
  createdByUserId: string
) {
  // Verify school exists
  const school = await prisma.school.findUnique({ where: { id: schoolId } });
  if (!school) {
    throw ApiError.notFound('School not found');
  }

  // Verify class exists if provided
  if (classId) {
    const classObj = await prisma.class.findUnique({
      where: { id: classId },
    });
    if (!classObj || classObj.schoolId !== schoolId) {
      throw ApiError.notFound('Class not found or does not belong to this school');
    }
  }

  const token = generateToken();
  const tokenHash = hashToken(token);
  const expiresAt = new Date(Date.now() + expiresInHours * 60 * 60 * 1000);

  await prisma.inviteToken.create({
    data: {
      tokenHash,
      email,
      schoolId,
      classId,
      intendedRole: role,
      expiresAt,
      createdByUserId,
    },
  });

  const inviteUrl = buildInviteUrl(token);
  await sendInviteEmail({
    to: email,
    inviteUrl,
    role: role === InviteRole.TEACHER ? 'Teacher' : 'Student',
  });

  return { inviteUrl, expiresAt };
}

export async function getSchool(schoolId: string) {
  const school = await prisma.school.findUnique({
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
  });

  if (!school) {
    throw ApiError.notFound('School not found');
  }

  return school;
}

export async function getAllSchools() {
  const schools = await prisma.school.findMany({
    include: {
      classes: {
        select: {
          id: true,
          name: true,
        },
      },
      memberships: {
        select: {
          id: true,
          roleInSchool: true,
          user: {
            select: {
              id: true,
              email: true,
              name: true,
            },
          },
        },
      },
      _count: {
        select: {
          classes: true,
          memberships: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return schools;
}

export async function getSchoolClasses(schoolId: string) {
  // Verify school exists
  const school = await prisma.school.findUnique({ where: { id: schoolId } });
  if (!school) {
    throw ApiError.notFound('School not found');
  }

  const classes = await prisma.class.findMany({
    where: { schoolId },
    include: {
      enrollments: {
        select: {
          id: true,
          roleInClass: true,
          user: {
            select: {
              id: true,
              email: true,
              name: true,
            },
          },
        },
      },
      _count: {
        select: {
          enrollments: true,
          messages: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return classes;
}
