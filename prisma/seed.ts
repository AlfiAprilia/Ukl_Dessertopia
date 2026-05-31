import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const accounts = [
    {
      email: 'admin@dessertopia.com',
      password: 'admin123',
      role: 'admin' as const,
      name: 'Super Admin',
    },
    {
      email: 'seller@dessertopia.com',
      password: 'seller123',
      role: 'seller' as const,
      name: 'Toko Dessertopia',
    },
  ];

  for (const account of accounts) {
    const existing = await prisma.auth.findUnique({
      where: { email: account.email },
    });

    if (existing) {
      console.log(`⚠️  Skip: ${account.email} sudah ada`);
      continue;
    }

    const hashedPassword = await bcrypt.hash(account.password, 10);

    await prisma.$transaction(async (tx) => {
      const auth = await tx.auth.create({
        data: {
          email: account.email,
          password: hashedPassword,
          role: account.role,
        },
      });

      await tx.user.create({
        data: {
          auth_id: auth.id,
          name: account.name,
        },
      });
    });

    console.log(`✅ Created ${account.role}: ${account.email}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });