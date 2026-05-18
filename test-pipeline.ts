import { createHash } from 'crypto';
import { prisma } from './lib/prisma';
import { ai } from './lib/ai';
import { z } from 'zod';

const postSchema = z.object({
  post: z.string(),
  hashtags: z.array(z.string()).min(3).max(5),
});

async function testGenerate() {
  console.log('=== AI GENERATION PIPELINE TEST ===\n');

  // 1. Health check - database connection
  console.log('1. Database connection...');
  const health = await prisma.$queryRaw`SELECT 1 as ok`;
  console.log('   OK:', health);

  // 2. User check
  console.log('\n2. Checking user...');
  const user = await prisma.user.findUnique({
    where: { email: 'aams1969@gmail.com' },
    select: { id: true, email: true, plan: true, role: true, dailyPostsUsed: true, totalPostsUsed: true, credits: true },
  });
  if (!user) {
    console.log('   ERROR: User not found');
    return;
  }
  console.log('   User:', user.email);
  console.log('   Plan:', user.plan);
  console.log('   Role:', user.role);

  // 3. AI generation test
  console.log('\n3. Testing AI generation (Gemini 2.0 Flash)...');
  const prompt = 'Write a concise x post about the future of AI in marketing. Keep it sharp and useful. Include relevant hashtags.';
  const result = await ai.generate({
    prompt,
    schema: postSchema,
    config: { provider: 'gemini' },
    trace: { requestId: 'test-001', event: 'test.generate' },
  });
  console.log('   Generated post:');
  console.log('   ', result.post.substring(0, 200));
  console.log('   Hashtags:', result.hashtags);

  // 4. Save post
  console.log('\n4. Saving post to database...');
  const post = await prisma.post.create({
    data: {
      userId: user.id,
      content: result.post,
      platform: 'x',
      prompt: 'Test prompt',
    },
  });
  console.log('   Post saved:', post.id);

  // 5. User stats after
  console.log('\n5. User stats after generation...');
  const updatedUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { dailyPostsUsed: true, totalPostsUsed: true, credits: true },
  });
  console.log('   dailyPostsUsed:', updatedUser?.dailyPostsUsed);
  console.log('   totalPostsUsed:', updatedUser?.totalPostsUsed);

  // 6. MediaJob test
  console.log('\n6. Testing MediaJob creation...');
  const mediaJob = await prisma.mediaJob.create({
    data: {
      userId: user.id,
      type: 'IMAGE',
      prompt: 'Test media generation',
      stylePreset: 'DEFAULT',
      status: 'COMPLETED',
    },
  });
  console.log('   MediaJob saved:', mediaJob.id);

  console.log('\n=== ALL TESTS PASSED ===');
}

testGenerate()
  .catch(e => console.error('TEST FAILED:', e.message))
  .finally(() => prisma.$disconnect());
