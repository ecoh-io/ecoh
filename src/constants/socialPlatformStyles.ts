export interface PlatformStyle {
  gradient: string[]; // Gradient background
  text: string; // Text (and icon) color
}

export const SOCIAL_PLATFORM_STYLES: Record<string, PlatformStyle> = {
  facebook: {
    gradient: ['#4C69BA', '#3B5998'], // Smooth dark-to-standard blue transition
    text: '#ffffff',
  },
  instagram: {
    gradient: ['#FF9A3E', '#E13A6C', '#AD3EB0', '#7367E5'], // Balanced transition
    text: '#ffffff',
  },
  github: {
    gradient: ['#4B4B4B', '#2E2E2E', '#333333'], // Slightly refined for depth
    text: '#ffffff',
  },
  linkedin: {
    gradient: ['#0095D5', '#0082B2', '#0077B5'], // Smoother blue progression
    text: '#ffffff',
  },
  spotify: {
    gradient: ['#1ED760', '#1AB34A', '#15903C'], // Deeper green for richness
    text: '#ffffff',
  },
  soundcloud: {
    gradient: ['#FFAA33', '#FF7B00', '#FF5500'], // Smooth orange transition
    text: '#ffffff',
  },
  youtube: {
    gradient: ['#FF4F4F', '#E60000', '#FF0000'], // Better red depth
    text: '#ffffff',
  },
  discord: {
    gradient: ['#7983F5', '#6871E5', '#5865F2'], // More natural blend
    text: '#ffffff',
  },
  twitch: {
    gradient: ['#B084FF', '#9C5FFF', '#9146FF'], // Enhanced purple vibrancy
    text: '#ffffff',
  },
  reddit: {
    gradient: ['#FF8E55', '#FF6435', '#FF4500'], // Warm & smooth orange transition
    text: '#ffffff',
  },
  tiktok: {
    gradient: ['#20D5DC', '#A5367D', '#FE2C55'], // Added a midpoint for smooth blending
    text: '#ffffff',
  },
};
