// theme.js
export const theme = {
  colors: {
    primary: '#5e8cff',        // Slightly brighter blue for visibility on dark
    primaryDark: '#3a5fb8',
    primaryLight: '#8ba8ff',
    secondary: '#64b5f6',
    success: '#66bb6a',
    warning: '#ffa726',
    error: '#ef5350',
    white: '#ffffff',
    black: '#000000',
    background: '#121212',     // Main dark background
    surface: '#1e1e1e',        // Cards, sidebar, modals
    lightGray: '#535353',
    mediumGray: '#3a3939b6',
    darkGray: '#2b2a2aff',
    text: {
      primary: '#e0e0e0',      // Main text
      secondary: '#aaaaaa',    // Subtext
      disabled: '#757575'
    }
  },
  glass: {
    background: 'rgba(30, 30, 30, 0.65)',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.37)',
  },

  glossy: {
    activeGlow: 'inset 0 2px 8px rgba(255, 255, 255, 0.15)',
    hoverGlow: '0 0 12px rgba(94, 140, 255, 0.3)',
    innerShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.1)',
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px'
  },
  borderRadius: {
    small: '4px',
    medium: '8px',
    large: '12px',
    round: '50%'
  },
  shadows: {
    small: '0 1px 3px rgba(0,0,0,0.3), 0 1px 2px rgba(0,0,0,0.4)',
    medium: '0 3px 6px rgba(0,0,0,0.4), 0 3px 6px rgba(0,0,0,0.5)',
    large: '0 10px 20px rgba(0,0,0,0.5), 0 6px 6px rgba(0,0,0,0.6)'
  },
  transitions: {
    fast: '0.2s ease',
    medium: '0.3s ease',
    slow: '0.5s ease'
  },
  breakpoints: {
    mobile: '768px',
    tablet: '1024px',
    desktop: '1200px'
  }
};