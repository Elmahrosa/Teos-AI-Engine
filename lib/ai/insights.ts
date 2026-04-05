type Platform = 'x' | 'facebook' | 'instagram' | 'linkedin';
type Goal = 'engagement' | 'authority' | 'sales' | 'community';

export function getVisibilityScore(post: string, hashtags: string[], goal: Goal) {
  let score = 58;
  if (post.length > 80 && post.length < 420) score += 10;
  if (/\?|:$/.test(post.split('\n')[0] || '')) score += 6;
  if (/\n\n/.test(post)) score += 5;
  if (hashtags.length >= 3) score += 8;
  if (/(what|why|how|mistake|truth|shift|reason)/i.test(post)) score += 8;
  if (goal === 'sales' && /(dm|book|start|try|join|buy)/i.test(post)) score += 5;
  return Math.min(score, 95);
}

export function getBestTime(platform: Platform) {
  const times: Record<Platform, string> = {
    x: 'Weekdays, 9:00–11:00 AM local time',
    facebook: 'Weekdays, 1:00–3:00 PM local time',
    instagram: 'Weekdays, 6:00–8:00 PM local time',
    linkedin: 'Tuesday to Thursday, 8:00–10:00 AM local time',
  };
  return times[platform];
}

export function getSuggestedCTA(goal: Goal) {
  const ctas: Record<Goal, string> = {
    engagement: 'End with a question to pull comments.',
    authority: 'Close with a firm takeaway or market insight.',
    sales: 'Use one direct action like DM, join, or start.',
    community: 'Invite shared examples or opinions from the audience.',
  };
  return ctas[goal];
}

export function getChecklist(platform: Platform, goal: Goal) {
  const items = [
    'Strong first line',
    'One clear main idea',
    'Specific context, not vague claims',
    getSuggestedCTA(goal),
  ];
  if (platform === 'instagram') items.push('Use line breaks for readability');
  if (platform === 'linkedin') items.push('Keep the tone professional and concrete');
  return items.slice(0, 5);
}
