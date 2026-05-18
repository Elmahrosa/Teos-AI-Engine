import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

console.log('=== AI GENERATION PIPELINE TEST ===\n');

try {
  console.log('1. Database connection...');
  const count = await prisma.user.count();
  console.log('   Users in DB:', count);

  console.log('\n2. Checking user...');
  const user = await prisma.user.findUnique({
    where: { email: 'aams1969@gmail.com' },
    select: { id: true, email: true, plan: true, role: true, dailyPostsUsed: true, totalPostsUsed: true, credits: true },
  });
  if (!user) { console.log('   ERROR: User not found'); process.exit(1); }
  console.log('   User:', user.email, '| Plan:', user.plan, '| Role:', user.role);

  console.log('\n3. Testing AI generation (Gemini)...');
  const { google } = await import('@ai-sdk/google');
  const { generateObject } = await import('ai');
  const { z } = await import('zod');

  const postSchema = z.object({
    post: z.string(),
    hashtags: z.array(z.string()).min(3).max(5),
  });

  const result = await generateObject({
    model: google('gemini-2.0-flash'),
    prompt: 'Write a concise X/Twitter post about the future of AI in marketing.',
    schema: postSchema,
  });
  console.log('   Post:', result.object.post.substring(0, 200));
  console.log('   Hashtags:', result.object.hashtags);

  console.log('\n4. Saving post...');
  const post = await prisma.post.create({
    data: { userId: user.id, content: result.object.post, platform: 'x', prompt: 'Test' },
  });
  console.log('   Saved:', post.id);

  console.log('\n5. Testing MediaJob...');
  const mediaJob = await prisma.mediaJob.create({
    data: { userId: user.id, type: 'IMAGE', prompt: 'Test media', stylePreset: 'DEFAULT', status: 'COMPLETED' },
  });
  console.log('   Saved:', mediaJob.id);

  console.log('\n=== ALL TESTS PASSED ===');
} catch (e) {
  console.error('TEST FAILED:', e.message);
  console.error(e.stack?.split('\n').slice(0, 5).join('\n'));
} finally {
  await prisma.$disconnect();
}
