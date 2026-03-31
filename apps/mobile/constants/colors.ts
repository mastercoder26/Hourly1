// Hourly Design System — Colors
// Premium dark theme inspired by fintech dashboards

const tintColorLight = '#2f95dc';
const tintColorDark = '#fff';

export const Colors = {
  // Primary accent (green for positive/success)
  accent: '#4CAF50',
  accentSoft: 'rgba(76, 175, 80, 0.12)',
  
  // Legacy aliases
  teal: '#4CAF50',
  tealSoft: 'rgba(76, 175, 80, 0.12)',
  purple: '#FFFFFF',
  purpleSoft: 'rgba(255, 255, 255, 0.08)',
  
  // Status colors
  warning: '#FFC107',
  warningSoft: 'rgba(255, 193, 7, 0.12)',
  urgencyOrange: '#FF9800',
  urgencyOrangeSoft: 'rgba(255, 152, 0, 0.12)',
  urgencyRed: '#F44336',
  urgencyRedSoft: 'rgba(244, 67, 54, 0.12)',
  success: '#4CAF50',
  successSoft: 'rgba(76, 175, 80, 0.12)',
  error: '#F44336',
  errorSoft: 'rgba(244, 67, 54, 0.12)',
  info: '#2196F3',
  infoSoft: 'rgba(33, 150, 243, 0.12)',
  
  light: {
    text: '#000',
    background: '#fff',
    tint: tintColorLight,
    tabIconDefault: '#ccc',
    tabIconSelected: tintColorLight,
  },
  
  dark: {
    // Background hierarchy
    base: '#000000',           // Pure black base
    card: '#1C1C1E',           // Floating card background
    cardElevated: '#242426',   // Elevated cards (modals, overlays)
    element: '#2C2C2E',        // Buttons, inputs, chips
    elementHover: '#3A3A3C',   // Hover/focus state
    elementActive: '#48484A',  // Active/pressed state
    divider: 'rgba(255, 255, 255, 0.06)',
    
    // Text hierarchy
    textPrimary: '#FFFFFF',
    textSecondary: '#8E8E93',
    textTertiary: '#636366',
    textDisabled: '#48484A',
    
    // Legacy aliases
    text: '#fff',
    background: '#000',
    tint: tintColorDark,
    tabIconDefault: '#8E8E93',
    tabIconSelected: tintColorDark,
  },

  // Cause tags with matching soft variants
  causeTags: {
    Environment: '#4CAF50',
    Education: '#2196F3',
    Food: '#FF9800',
    Animals: '#795548',
    Seniors: '#9C27B0',
    Youth: '#E91E63',
    Health: '#F44336',
    Arts: '#00BCD4',
  } as Record<string, string>,
  
  causeTagsSoft: {
    Environment: 'rgba(76, 175, 80, 0.12)',
    Education: 'rgba(33, 150, 243, 0.12)',
    Food: 'rgba(255, 152, 0, 0.12)',
    Animals: 'rgba(121, 85, 72, 0.12)',
    Seniors: 'rgba(156, 39, 176, 0.12)',
    Youth: 'rgba(233, 30, 99, 0.12)',
    Health: 'rgba(244, 67, 54, 0.12)',
    Arts: 'rgba(0, 188, 212, 0.12)',
  } as Record<string, string>,
};

export const CardStyle = {
  borderRadius: 28,
  borderRadiusSmall: 20,
  borderRadiusTiny: 12,
  padding: 32,
  paddingSmall: 20,
  paddingTiny: 16,
};

export const Shadows = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 12,
  },
  cardSubtle: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  button: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
};

export default Colors;
