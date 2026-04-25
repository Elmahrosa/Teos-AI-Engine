export type Platform = 'x' | 'linkedin' | 'facebook' | 'instagram' | 'tiktok' | 'threads' | 'telegram';

export const PLATFORMS: Record<Platform, {
  icon: string;
  label: string;
  style: string;
 hashtags: () => number;
}> = {
  x: {
    icon: '𝕏',
    label: 'X',
    style: 'short, sharp, punchy, thread-ready',
    hashtags: () => Math.floor(Math.random() * 3) + 1, // 1-3
  },
  linkedin: {
    icon: 'in',
    label: 'LinkedIn',
    style: 'professional, founder story, authority insight',
    hashtags: () => Math.floor(Math.random() * 3) + 3, // 3-5
  },
  facebook: {
    icon: 'f',
    label: 'Facebook',
    style: 'community, conversational, friendly',
    hashtags: () => Math.floor(Math.random() * 3) + 2, // 2-4
  },
  instagram: {
    icon: '◎',
    label: 'Instagram',
    style: 'visual caption, emotional hook, emoji-balanced',
    hashtags: () => Math.floor(Math.random() * 4) + 5, // 5-8
  },
  tiktok: {
    icon: '♪',
    label: 'TikTok',
    style: 'short video hook, script angle, punchy CTA',
    hashtags: () => Math.floor(Math.random() * 4) + 4, // 4-7
  },
  threads: {
    icon: '@',
    label: 'Threads',
    style: 'short conversation starter',
    hashtags: () => Math.floor(Math.random() * 3) + 1, // 1-3
  },
  telegram: {
    icon: '✈',
    label: 'Telegram',
    style: 'community update / channel post',
    hashtags: () => Math.floor(Math.random() * 3) + 2, // 2-4
  },
};

export function getPlatformInfo(platform: string) {
  const p = platform.toLowerCase() as Platform;
  return PLATFORMS[p] || PLATFORMS.x;
}

// CTA pool (25 options)
const CTA_POOL = [
  'What would you improve?',
  'Would this help your audience?',
  'Agree or disagree?',
  'Building this in public — roast it.',
  'Try it and tell me what feels weak.',
  'Save this if you are building.',
  'Drop a comment if you want early access.',
  'Which version would you post?',
  'Early feedback welcome.',
  'Share this with a founder who needs it.',
  'Want the exact workflow?',
  'Should I make a video version?',
  'Would you use this?',
  'Comment "TEOS" if you want to test it.',
  'What should I build next?',
  'Which part resonates most?',
  'Tag someone who needs to see this.',
  'What\'s your take on this approach?',
  'Help me validate this idea.',
  'How would you approach this differently?',
  'This took me 3 days — worth it?',
  'Thoughts on this workflow?',
  'Who else is experiencing this problem?',
  'What would make this better?',
  'Drop your best tip below.',
];

let lastCTA: string | null = null;

export function getRandomCTA(): string {
  let cta: string;
  do {
    cta = CTA_POOL[Math.floor(Math.random() * CTA_POOL.length)];
  } while (cta === lastCTA && CTA_POOL.length > 1);
  lastCTA = cta;
  return cta;
}

// Topic-aware hashtag pools
const HASHTAG_POOLS = {
  ai: ['AI', 'AItools', 'ArtificialIntelligence', 'Automation', 'MachineLearning', 'TechInnovation'],
  saas: ['SaaS', 'Startup', 'BuildInPublic', 'Founders', 'Entrepreneurship', 'ProductBuilding'],
  pi: ['PiNetwork', 'Web3', 'DigitalEconomy', 'Crypto', 'BlockchainTech', 'FutureOfMoney'],
  egypt: ['Egypt', 'MENA', 'MiddleEast', 'ArabicContent', 'EgyptTech', 'AfricaTech'],
  content: ['ContentMarketing', 'CreatorEconomy', 'SocialMedia', 'Growth', 'Engagement', 'Marketing'],
  generic: ['Teos', 'TeosAI', 'ContentCreation', 'Growth', 'Strategy', 'Innovation', 'Future'],
};

function detectTopic(topic: string): string[] {
  const lower = topic.toLowerCase();
  const pools: string[] = [];

  if (/\b(ai|artificial|machine|learning|algorithm|neural|gpt)\b/.test(lower)) pools.push('ai');
  if (/\b(saas|startup|founder|build|product|launch|ship)\b/.test(lower)) pools.push('saas');
  if (/\b(pi|network|web3|crypto|blockchain|defi)\b/.test(lower)) pools.push('pi');
  if (/\b(egypt|cairo|arb|mena|middle east|arabic)\b/.test(lower)) pools.push('egypt');
  if (/\b(content|creator|social|marketing|brand|audience)\b/.test(lower)) pools.push('content');

  return pools.length > 0 ? pools : ['generic'];
}

let lastHashtags: Set<string> = new Set();

export function getSmartHashtags(topic: string, platform: Platform): string[] {
  const count = PLATFORMS[platform].hashtags();
  const topicPools = detectTopic(topic);
  const selectedPool = HASHTAG_POOLS[topicPools[Math.floor(Math.random() * topicPools.length)] as keyof typeof HASHTAG_POOLS];
  
  const allTags = [
    ...selectedPool,
    ...HASHTAG_POOLS.generic,
  ];

  const hashtags: string[] = [];
  const attempts = new Set<string>();

  while (hashtags.length < count && attempts.size < allTags.length) {
    const tag = allTags[Math.floor(Math.random() * allTags.length)];
    if (!attempts.has(tag) && !lastHashtags.has(tag)) {
      hashtags.push(tag);
      attempts.add(tag);
    }
  }

  lastHashtags = new Set(hashtags);
  return hashtags.length > 0 ? hashtags : allTags.slice(0, count);
}

// Best time calculation
export function getBestTime(platform: Platform): string {
  const times: Record<Platform, string[]> = {
    x: ['9 AM - 12 PM', '6 PM - 9 PM'],
    linkedin: ['8 AM - 10 AM', '12 PM - 2 PM'],
    facebook: ['1 PM - 4 PM', '7 PM - 9 PM'],
    instagram: ['11 AM - 1 PM', '6 PM - 9 PM'],
    tiktok: ['6 PM - 10 PM', '12 PM - 3 PM'],
    threads: ['8 AM - 11 AM', '7 PM - 9 PM'],
    telegram: ['10 AM - 1 PM', '8 PM - 10 PM'],
  };

  const platformTimes = times[platform] || times.x;
  return platformTimes[Math.floor(Math.random() * platformTimes.length)];
}

// Dynamic visibility score calculation
export function calculateVisibilityScore(params: {
  topic: string;
  platform: Platform;
  tone: string;
  goal: string;
  post: string;
  hashtags: string[];
}): number {
  let score = 55;

  // Content quality
  if (params.post.length >= 80 && params.post.length <= 280) score += 8;
  if (params.post.length > 280 && params.post.length <= 500) score += 6;

  // Opening impact
  const firstLine = params.post.split('\n')[0];
  if (/^[A-Z]/.test(firstLine)) score += 3;
  if (firstLine.length > 15 && firstLine.length < 80) score += 5;

  // Engagement triggers
  if (/\?/.test(params.post)) score += 6;
  if (/\:|—|-/.test(firstLine)) score += 4;
  if (/\n\n/.test(params.post)) score += 4;

  // CTA presence
  if (/(what|would|agree|disagree|save|comment|share|help|think|tag|roast)/.test(params.post.toLowerCase())) score += 7;

  // Specificity
  if (/\d+|\/\/|\%/.test(params.post)) score += 5;
  if (params.post.includes('#')) score += 3;

  // Platform fit
  if (params.platform === 'linkedin' && params.post.length > 200) score += 5;
  if (params.platform === 'x' && params.post.length < 240) score += 6;
  if (params.platform === 'instagram' && /\n/.test(params.post)) score += 4;

  // Hashtag quality
  if (params.hashtags.length >= 3) score += 5;
  if (params.hashtags.length >= 5 && params.platform === 'instagram') score += 4;

  // Tone/Goal alignment
  if (params.tone === 'viral hook' || params.goal === 'engagement') score += 4;
  if (params.tone === 'authority' || params.goal === 'authority') score += 3;

  // Novelty factor - never hardcode
  const variance = Math.floor(Math.random() * 7) - 3; // ±3
  score += variance;

  return Math.max(55, Math.min(98, score));
}
