type Platform = 'x' | 'facebook' | 'instagram' | 'linkedin';
export type Tone = 'professional' | 'bold' | 'educational' | 'conversational';
export type Goal = 'engagement' | 'authority' | 'sales' | 'community';

function fallbackPost(topic: string, platform: Platform, tone: Tone, goal: Goal) {
  const topicTag = topic.replace(/\s+/g, '');
  const openers: Record<Tone, string> = {
    professional: `${topic} is becoming more important for teams that care about discoverability and positioning.`,
    bold: `Most people are still underestimating ${topic}. That is a mistake.`,
    educational: `Quick breakdown: here is why ${topic} matters and what to do next.`,
    conversational: `Let’s talk about ${topic} for a second, because it matters more than people think.`,
  };
  const ctas: Record<Goal, string> = {
    engagement: 'What is your take?',
    authority: 'This is the shift serious builders should pay attention to.',
    sales: 'If you want help turning this into real growth, now is the time to act.',
    community: 'Add your view below so we can compare what we are seeing.',
  };

  const responses: Record<Platform, string> = {
    x: `${openers[tone]}\n\n3 quick points:\n1. Context compounds visibility\n2. Mentions shape recall\n3. Consistency beats noise\n\n${ctas[goal]} #AI #${topicTag}`,
    facebook: `${openers[tone]}\n\nWhen AI systems answer questions, they reward clear context, repeated mentions, and useful content.\n\n${ctas[goal]} #${topicTag} #Growth`,
    instagram: `${openers[tone]}\n\nStrong ideas + clean visuals + the right context = better discovery.\n\n${ctas[goal]} #${topicTag} #Create`,
    linkedin: `${openers[tone]}\n\nAI-driven discovery is changing how brands get seen. Teams that publish clear, contextual content will earn more trust and attention.\n\n${ctas[goal]} #Leadership #${topicTag}`,
  };
  return responses[platform];
}

export async function generatePost(topic: string, platform: Platform, tone: Tone = 'professional', goal: Goal = 'engagement') {
  const apiKey = process.env.OPENAI_API_KEY || process.env.AI_API_KEY;
  if (!apiKey) return fallbackPost(topic, platform, tone, goal);

  const platformInstructions: Record<Platform, string> = {
    x: 'Create a punchy X post under 240 characters with one strong hook, short rhythm, and 3 relevant hashtags.',
    facebook: 'Create a Facebook post with a conversational tone, 1 short paragraph, and 3 relevant hashtags.',
    instagram: 'Create an Instagram caption with a clear hook, line breaks, and 5 relevant hashtags.',
    linkedin: 'Create a professional LinkedIn post with a strong opening, 3 concise value points, and 3 relevant hashtags.',
  };

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || 'gpt-4.1-nano',
      temperature: 0.85,
      messages: [
        {
          role: 'system',
          content:
            'You are an expert social media strategist. Focus on discoverability, contextual relevance, strong hooks, clean CTA, and natural wording. Return plain text only. Avoid emojis unless useful. Do not wrap output in quotes.',
        },
        {
          role: 'user',
          content: [
            platformInstructions[platform],
            `Tone: ${tone}`,
            `Primary goal: ${goal}`,
            'Use current content patterns that tend to perform well: a strong first line, one clear idea, useful specificity, and a direct closing CTA.',
            `Topic: ${topic}`,
          ].join('\n'),
        },
      ],
    }),
  });

  if (!response.ok) return fallbackPost(topic, platform, tone, goal);
  const data = await response.json();
  return data.choices?.[0]?.message?.content?.trim() || fallbackPost(topic, platform, tone, goal);
}
