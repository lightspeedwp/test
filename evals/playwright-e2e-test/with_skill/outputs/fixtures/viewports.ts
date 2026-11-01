/**
 * Viewport Fixtures and Configuration
 *
 * Standard viewport sizes for responsive testing across devices.
 * Includes mobile, tablet, and desktop configurations.
 */

export interface ViewportConfig {
  name: string;
  width: number;
  height: number;
  deviceScaleFactor?: number;
  userAgent?: string;
  isMobile?: boolean;
  hasTouch?: boolean;
}

/**
 * Standard viewport configurations
 */
export const VIEWPORTS: Record<string, ViewportConfig> = {
  // Mobile viewports
  mobile: {
    name: 'Mobile',
    width: 375,
    height: 812,
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  },
  mobileSmall: {
    name: 'Mobile Small',
    width: 320,
    height: 568,
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  },
  mobileLarge: {
    name: 'Mobile Large',
    width: 414,
    height: 896,
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  },

  // Tablet viewports
  tablet: {
    name: 'Tablet',
    width: 768,
    height: 1024,
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  },
  tabletLandscape: {
    name: 'Tablet Landscape',
    width: 1024,
    height: 768,
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  },

  // Desktop viewports
  desktop: {
    name: 'Desktop',
    width: 1920,
    height: 1080,
    deviceScaleFactor: 1,
    isMobile: false,
    hasTouch: false,
  },
  desktopSmall: {
    name: 'Desktop Small',
    width: 1280,
    height: 720,
    deviceScaleFactor: 1,
    isMobile: false,
    hasTouch: false,
  },
  desktop4K: {
    name: 'Desktop 4K',
    width: 3840,
    height: 2160,
    deviceScaleFactor: 2,
    isMobile: false,
    hasTouch: false,
  },

  // Specific device emulations
  iphone12: {
    name: 'iPhone 12',
    width: 390,
    height: 844,
    deviceScaleFactor: 3,
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X)',
    isMobile: true,
    hasTouch: true,
  },
  ipad: {
    name: 'iPad',
    width: 810,
    height: 1080,
    deviceScaleFactor: 2,
    userAgent: 'Mozilla/5.0 (iPad; CPU OS 14_7_1 like Mac OS X)',
    isMobile: true,
    hasTouch: true,
  },
  androidPhone: {
    name: 'Android Phone',
    width: 360,
    height: 640,
    deviceScaleFactor: 2,
    userAgent: 'Mozilla/5.0 (Linux; Android 11; SM-G991B)',
    isMobile: true,
    hasTouch: true,
  },
};

/**
 * Responsive test breakpoints aligned with common CSS breakpoints
 */
export const BREAKPOINTS = {
  mobile: 480,
  mobileLarge: 768,
  tablet: 1024,
  desktop: 1280,
  desktopLarge: 1920,
  desktop4K: 2560,
};

/**
 * Common touch target sizes (minimum 44x44 for accessibility)
 */
export const TOUCH_TARGETS = {
  minimum: 44,
  recommended: 48,
  large: 56,
};

/**
 * Common text sizes for readability testing
 */
export const TEXT_SIZES = {
  minimum: 12,
  small: 14,
  body: 16,
  large: 18,
  heading: 24,
};

/**
 * Get viewport for testing
 */
export function getViewport(name: string): ViewportConfig {
  return VIEWPORTS[name] || VIEWPORTS.desktop;
}

/**
 * Get all mobile viewports
 */
export function getMobileViewports(): ViewportConfig[] {
  return Object.values(VIEWPORTS).filter((v) => v.isMobile);
}

/**
 * Get all desktop viewports
 */
export function getDesktopViewports(): ViewportConfig[] {
  return Object.values(VIEWPORTS).filter((v) => !v.isMobile);
}

/**
 * Get all tablet viewports
 */
export function getTabletViewports(): ViewportConfig[] {
  return [VIEWPORTS.tablet, VIEWPORTS.tabletLandscape, VIEWPORTS.ipad];
}

/**
 * Check if viewport is mobile-sized
 */
export function isMobileViewport(width: number): boolean {
  return width < BREAKPOINTS.tablet;
}

/**
 * Check if viewport is tablet-sized
 */
export function isTabletViewport(width: number): boolean {
  return width >= BREAKPOINTS.tablet && width < BREAKPOINTS.desktop;
}

/**
 * Check if viewport is desktop-sized
 */
export function isDesktopViewport(width: number): boolean {
  return width >= BREAKPOINTS.desktop;
}

/**
 * Check if element meets minimum touch target size
 */
export function hasValidTouchTarget(width: number, height: number): boolean {
  return width >= TOUCH_TARGETS.minimum && height >= TOUCH_TARGETS.minimum;
}

/**
 * Check if text size is readable
 */
export function isReadableTextSize(fontSize: number): boolean {
  return fontSize >= TEXT_SIZES.small;
}

/**
 * Viewport test scenarios for comprehensive testing
 */
export const RESPONSIVE_TEST_SCENARIOS = [
  {
    name: 'Mobile Portrait',
    viewports: [VIEWPORTS.mobileSmall, VIEWPORTS.mobile, VIEWPORTS.mobileLarge],
  },
  {
    name: 'Tablet',
    viewports: [VIEWPORTS.tablet, VIEWPORTS.tabletLandscape],
  },
  {
    name: 'Desktop',
    viewports: [VIEWPORTS.desktopSmall, VIEWPORTS.desktop],
  },
  {
    name: 'All Devices',
    viewports: Object.values(VIEWPORTS),
  },
  {
    name: 'Common Devices',
    viewports: [VIEWPORTS.iphone12, VIEWPORTS.ipad, VIEWPORTS.androidPhone, VIEWPORTS.desktop],
  },
];

/**
 * Get test scenario viewports
 */
export function getTestScenario(scenarioName: string): ViewportConfig[] {
  const scenario = RESPONSIVE_TEST_SCENARIOS.find((s) => s.name === scenarioName);
  return scenario?.viewports || [VIEWPORTS.desktop];
}
