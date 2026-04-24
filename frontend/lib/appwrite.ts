import { createMockProxy } from './mockProxy';
export const appwrite = createMockProxy('appwrite');
export const databases = createMockProxy('databases');
export const account = createMockProxy('account');
export const storage = createMockProxy('storage');
export const ID = { unique: () => 'mock-id' };
export const Query = {
  equal: () => '',
  search: () => '',
  limit: () => '',
  orderDesc: () => ''
};
export const client = createMockProxy('client');
