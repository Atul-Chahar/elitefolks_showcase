import { createMockProxy } from '../lib/mockProxy';
export const analyticsService = createMockProxy('analyticsService');
export const trackEvent = createMockProxy('trackEvent');
export const analytics = createMockProxy('analytics');
