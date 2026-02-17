import prisma from '../prisma';
import { ApiError } from '../errors/ApiError';

export async function createMessage(classId: string, authorId: string, text: string) {
  // Verify class exists
  const classObj = await prisma.class.findUnique({ where: { id: classId } });
  if (!classObj) {
    throw ApiError.notFound('Class not found');
  }

  const message = await prisma.message.create({
    data: {
      classId,
      authorId,
      text,
    },
    include: {
      author: {
        select: {
          id: true,
          email: true,
          name: true,
        },
      },
    },
  });

  return message;
}

export async function getMessages(classId: string) {
  const messages = await prisma.message.findMany({
    where: { classId },
    include: {
      author: {
        select: {
          id: true,
          email: true,
          name: true,
        },
      },
    },
    orderBy: { createdAt: 'asc' },
  });

  return messages;
}

export async function getClass(classId: string) {
  const classObj = await prisma.class.findUnique({
    where: { id: classId },
    include: {
      school: true,
      enrollments: {
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

  if (!classObj) {
    throw ApiError.notFound('Class not found');
  }

  return classObj;
}

export async function getClassStudents(classId: string) {
  // Verify class exists
  const classObj = await prisma.class.findUnique({ where: { id: classId } });
  if (!classObj) {
    throw ApiError.notFound('Class not found');
  }

  const students = await prisma.classEnrollment.findMany({
    where: {
      classId,
      roleInClass: 'STUDENT',
    },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          name: true,
          createdAt: true,
        },
      },
    },
    orderBy: {
      createdAt: 'asc',
    },
  });

  return students.map(enrollment => ({
    enrollmentId: enrollment.id,
    enrolledAt: enrollment.createdAt,
    student: enrollment.user,
  }));
}
