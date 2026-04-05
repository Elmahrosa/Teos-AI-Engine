type Platform = 'x' | 'facebook' | 'instagram' | 'linkedin';

export function generateHashtags(topic: string, platform: Platform = 'x'): string[] {
  const words = topic
    .split(/\s+/)
    .map((part) => part.replace(/[^a-zA-Z0-9]/g, ''))
    .filter(Boolean)
    .slice(0, 3);

  const topicTags = words.map((w) => `#${w.charAt(0).toUpperCase()}${w.slice(1)}`);
  const byPlatform: Record<Platform, string[]> = {
    x: ['#AI', '#Growth', '#Visibility'],
    facebook: ['#AI', '#Marketing', '#Community'],
    instagram: ['#AI', '#Brand', '#Creator'],
    linkedin: ['#AI', '#Leadership', '#Strategy'],
  };

  return [...new Set([...byPlatform[platform], ...topicTags, '#Elmahrosa'])].slice(0, platform === 'instagram' ? 6 : 5);
}
