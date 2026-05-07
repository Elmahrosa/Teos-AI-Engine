import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL || 'aams1969@gmail.com';

  const existing = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (existing) {
    await prisma.user.update({
      where: { email: adminEmail },
      data: { plan: 'agency', status: 'active', isAdmin: true },
    });
    console.log(`✓ Founder account updated (admin): ${adminEmail}`);
  } else {
    await prisma.user.create({
      data: {
        email: adminEmail,
        name: 'Ayman Seif',
        plan: 'agency',
        status: 'active',
        isAdmin: true,
      },
    });
    console.log(`✓ Founder account created (admin): ${adminEmail}`);
  }
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
