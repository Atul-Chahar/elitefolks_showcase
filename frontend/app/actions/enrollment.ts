import { createMockProxy } from '../../lib/mockProxy';
export const enrollInCourse = createMockProxy('enrollInCourse');
export const getEnrollmentStatus = createMockProxy('getEnrollmentStatus');
export async function createEnrollment() { return { success: true } }
export const enrollUserInCourse = createMockProxy('enrollUserInCourse');
