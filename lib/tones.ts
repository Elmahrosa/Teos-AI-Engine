export type ToneMode = 
  | 'professional'
  | 'engagement'
  | 'authority'
  | 'founder_story'
  | 'launch'
  | 'contrarian'
  | 'community'
  | 'viral_hook'
  | 'educational'
  | 'sales_cta';

export const TONE_MODES: Record<ToneMode, {
  label: string;
  description: string;
}> = {
  professional: {
    label: 'Professional',
    description: 'Polished, clear, business-focused',
  },
  engagement: {
    label: 'Engagement',
    description: 'Questions, invitations, conversational',
  },
  authority: {
    label: 'Authority',
    description: 'Confident insights, market perspective',
  },
  founder_story: {
    label: 'Founder Story',
    description: 'Personal journey, lessons, vulnerability',
  },
  launch: {
    label: 'Launch',
    description: 'Excitement, exclusivity, early access',
  },
  contrarian: {
    label: 'Contrarian',
    description: 'Bold takes, challenge assumptions',
  },
  community: {
    label: 'Community',
    description: 'Inclusive, collaborative, belonging',
  },
  viral_hook: {
    label: 'Viral Hook',
    description: 'Surprise, pattern interrupt, curiosity gap',
  },
  educational: {
    label: 'Educational',
    description: 'Clear breakdown, step-by-step, value-add',
  },
  sales_cta: {
    label: 'Sales CTA',
    description: 'Action-oriented, direct offer, urgency',
  },
};

export function isToneMode(value: string): value is ToneMode {
  return value in TONE_MODES;
}
