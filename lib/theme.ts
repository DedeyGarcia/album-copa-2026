import { DarkTheme, DefaultTheme, type Theme } from '@react-navigation/native';

// Colors from global.css (OKLCH approximations to Hex for JS usage)
export const COLORS = {
  light: {
    background: '#ffffff',
    foreground: '#000000',
    card: '#ffffff',
    cardForeground: '#1e1b4b', // matches oklch(0.28 0.14 270)
    primary: '#1E5CFF', // FIFA Blue
    primaryForeground: '#ffffff',
    secondary: '#611CFF', // FIFA Purple
    secondaryForeground: '#ffffff',
    muted: '#f5f5f5',
    mutedForeground: '#737373',
    accent: '#A1FF00', // FIFA Lime
    accentForeground: '#1e1b4b',
    destructive: '#E60000',
    border: '#e5e5e5',
    input: '#e5e5e5',
  },
  dark: {
    background: '#151921', // approximate oklch(0.28 0.14 270)
    foreground: '#ffffff',
    card: '#1e242e',
    cardForeground: '#ffffff',
    primary: '#54FFCC', // Cyan
    primaryForeground: '#151921',
    secondary: '#611CFF',
    secondaryForeground: '#ffffff',
    muted: '#1e242e',
    mutedForeground: '#a3a3a3',
    accent: '#1E5CFF',
    accentForeground: '#ffffff',
    destructive: '#E60000',
    border: 'rgba(255, 255, 255, 0.15)',
    input: 'rgba(255, 255, 255, 0.2)',
  },
};

export const THEME = {
  light: {
    background: COLORS.light.background,
    foreground: COLORS.light.foreground,
    card: COLORS.light.card,
    cardForeground: COLORS.light.cardForeground,
    popover: COLORS.light.card,
    popoverForeground: COLORS.light.cardForeground,
    primary: COLORS.light.primary,
    primaryForeground: COLORS.light.primaryForeground,
    secondary: COLORS.light.secondary,
    secondaryForeground: COLORS.light.secondaryForeground,
    muted: COLORS.light.muted,
    mutedForeground: COLORS.light.mutedForeground,
    accent: COLORS.light.accent,
    accentForeground: COLORS.light.accentForeground,
    destructive: COLORS.light.destructive,
    border: COLORS.light.border,
    input: COLORS.light.input,
    ring: COLORS.light.secondary,
    radius: '0.625rem',
  },
  dark: {
    background: COLORS.dark.background,
    foreground: COLORS.dark.foreground,
    card: COLORS.dark.card,
    cardForeground: COLORS.dark.cardForeground,
    popover: COLORS.dark.card,
    popoverForeground: COLORS.dark.cardForeground,
    primary: COLORS.dark.primary,
    primaryForeground: COLORS.dark.primaryForeground,
    secondary: COLORS.dark.secondary,
    secondaryForeground: COLORS.dark.secondaryForeground,
    muted: COLORS.dark.muted,
    mutedForeground: COLORS.dark.mutedForeground,
    accent: COLORS.dark.accent,
    accentForeground: COLORS.dark.accentForeground,
    destructive: COLORS.dark.destructive,
    border: COLORS.dark.border,
    input: COLORS.dark.input,
    ring: COLORS.dark.primary,
    radius: '0.625rem',
  },
};

export const NAV_THEME: Record<'light' | 'dark', Theme> = {
  light: {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: COLORS.light.background,
      border: COLORS.light.border,
      card: COLORS.light.card,
      notification: COLORS.light.destructive,
      primary: COLORS.light.primary,
      text: COLORS.light.foreground,
    },
  },
  dark: {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      background: COLORS.dark.background,
      border: COLORS.dark.border,
      card: COLORS.dark.card,
      notification: COLORS.dark.destructive,
      primary: COLORS.dark.primary,
      text: COLORS.dark.foreground,
    },
  },
};
