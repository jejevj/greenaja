export const LIGHT = {
  bg:       '#F7F8FA',
  surface:  '#FFFFFF',
  surfaceAlt: 'rgba(255,255,255,0.6)',
  border:   'rgba(0,0,0,0.07)',
  primary:  '#1A7A4A',
  primaryMuted: 'rgba(26,122,74,0.08)',
  text:     '#0D1B12',
  textSub:  '#6B7C75',
  accent:   '#F0FAF4',
  danger:   '#D32F2F',
};

export const DARK = {
  bg:       '#0C120E',
  surface:  'rgba(255,255,255,0.05)',
  surfaceAlt: 'rgba(255,255,255,0.03)',
  border:   'rgba(255,255,255,0.08)',
  primary:  '#3DB870',
  primaryMuted: 'rgba(61,184,112,0.1)',
  text:     '#E8F5EE',
  textSub:  '#7AAB87',
  accent:   'rgba(61,184,112,0.08)',
  danger:   '#EF5350',
};

export type Theme = typeof LIGHT;
