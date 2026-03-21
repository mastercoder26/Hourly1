// Hourly Design System — Colors
// Matching the dark mode theme from React App.js reference

const tintColorLight = '#2f95dc';
const tintColorDark = '#fff';

export const Colors = {
  teal: '#00BFA5',    // Brand accent 1
  tealSoft: 'rgba(0, 191, 165, 0.15)',
  purple: '#B388FF',  // Brand accent 2
  purpleSoft: 'rgba(179, 136, 255, 0.15)',
  warning: '#FFC107',
  urgencyOrange: '#FF9800',
  urgencyRed: '#F44336',
  success: '#4CAF50',
  error: '#F44336',
  
  light: {
    text: '#000',
    background: '#fff',
    tint: tintColorLight,
    tabIconDefault: '#ccc',
    tabIconSelected: tintColorLight,
  },
  
  dark: {
    base: '#000000',       // Main background
    card: '#1C1C1E',       // Card background
    element: '#2C2C2E',    // Buttons/UI elements
    elementHover: '#3A3A3C',
    
    textPrimary: '#FFFFFF',
    textSecondary: '#8E8E93',
    textTertiary: '#636366',
    
    text: '#fff',
    background: '#000',
    tint: tintColorDark,
    tabIconDefault: '#ccc',
    tabIconSelected: tintColorDark,
  },

  causeTags: {
    Environment: '#4CAF50',
    Education: '#2196F3',
    Food: '#FF9800',
    Animals: '#795548',
    Seniors: '#9C27B0',
    Youth: '#E91E63',
    Health: '#F44336',
    Arts: '#00BCD4',
  } as Record<string, string>
};

export const CardStyle = {
  borderRadius: 28,
  padding: 32,
  paddingSmall: 20
};

export default Colors;
