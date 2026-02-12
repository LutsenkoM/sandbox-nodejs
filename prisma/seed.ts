import { PrismaClient, GlobalRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const email = process.env.SUPERADMIN_EMAIL;
  const password = process.env.SUPERADMIN_PASSWORD;

  if (!email || !password) {
    throw new Error('SUPERADMIN_EMAIL and SUPERADMIN_PASSWORD must be set');
  }

  // Check if super admin already exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    console.log('Super admin already exists:', email);
    return;
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const superAdmin = await prisma.user.create({
    data: {
      email,
      name: 'Super Admin',
      passwordHash,
      globalRole: GlobalRole.SUPER_ADMIN,
    },
  });

  console.log('Super admin created:', superAdmin.email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

