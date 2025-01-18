export const DEFAULT_THEME = {
  colors: {
    primary: '#535358',
    secondary: '#141414',
    background: 'white',

    textPrimary: '#535358',
    textHeader: '#201f2d',
    textSecondary: '#8e8e99',
    textSecondaryLight: '#aeaeb4',

    lightGrey1: '#dddde7',
    lightGrey2: '#e9e9e9',
    border: '#aeaeb4',

    textLink: '#1b07f2',

    successLight: '#21b04c0d',
    errorLight: '#ee726f1a',
    error: '#ee726f',
    success: '#22b14d',
    notice: '#f8d943',

    black: 'black',
    white: 'white',

    primaryHover: '#3c3c3d',
    primaryActive: '#2c2c2d',
    focusRing: '#1b07f2',

    info: '#17a2b8',
    warning: '#f39c12',

    overlayLight: 'rgba(0, 0, 0, 0.1)',
    overlayDark: 'rgba(0, 0, 0, 0.5)',
  },

  typography: {
    fontFamily:
      'line-to-circular, Helvetica Neue, Helvetica, Arial, sans-serif',
    bodySize: '16px',
    titleSize: '22px',
    captionSize: '12px',
    bodyLineHeight: '1.5',
    titleLineHeight: '1.2',
    captionLineHeight: '1.4',

    // Missing Typography Tokens
    h1Size: '32px', // Large heading size
    h2Size: '28px', // Medium heading size
    fontWeightLight: '300', // Lighter font weight
    fontWeightBold: '700', // Bold font weight

    // Letter Spacing
    letterSpacingSmall: '-0.5px',
    letterSpacingLarge: '1px',

    // Responsive Typography
    bodySizeSm: '14px', // Smaller body size for mobile
    titleSizeSm: '20px', // Smaller title size for mobile
  },

  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px',

    // Missing Spacing Tokens
    nano: '1px',
    micro: '2px',

    // Responsive Spacing
    smSpacing: '12px',
    lgSpacing: '40px',

    paddingXs: '4px',
    paddingSm: '8px',
    paddingMd: '16px',
    paddingLg: '24px',
    paddingXl: '32px',
    paddingXxl: '48px',

    marginXs: '4px',
    marginSm: '8px',
    marginMd: '16px',
    marginLg: '24px',
    marginXl: '32px',
    marginXxl: '48px',
  },

  borderRadius: {
    small: '4px',
    medium: '8px',
    large: '16px',
    pill: '9999px',
  },

  borderWidth: {
    thin: '1px',
    medium: '2px',
    thick: '3px',
  },

  shadows: {
    subtle: '0px 1px 2px rgba(0, 0, 0, 0.12)',
    medium: '0px 4px 8px rgba(0, 0, 0, 0.15)',
    strong: '0px 10px 20px rgba(0, 0, 0, 0.2)',

    shadowActive: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    shadowHover: '0px 4px 8px rgba(0, 0, 0, 0.2)',
  },

  animation: {
    fast: '150ms',
    medium: '300ms',
    slow: '500ms',

    easeIn: 'cubic-bezier(0.42, 0, 1, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.58, 1)',
  },

  breakpoints: {
    breakpointSm: '576px',
    breakpointMd: '768px',
    breakpointLg: '1024px',
    breakpointXl: '1200px',
  },

  gradients: {
    gradientPrimary: 'linear-gradient(to right, #22b14d, #1b07f2)', // Example gradient
    gradientBackground: 'linear-gradient(to top, #fff, #f8f8f8)', // Example background gradient
  },

  zIndex: {
    zIndexModal: '1050',
    zIndexTooltip: '1060',
    zIndexDropdown: '1040',
  },
};
