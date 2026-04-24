export const authService = {
  getCurrentUser: async () => ({
    $id: 'showcase_demouser_xyz',
    name: 'Showcase Viewer',
    email: 'viewer@showcase.local',
    registration: new Date().toISOString(),
    status: true,
    passwordUpdate: new Date().toISOString(),
    emailVerification: true,
    prefs: { avatarId: '1', onboardingCompleted: true, xp: 4500, level: 8, role: 'user' },
    accessedAt: new Date().toISOString()
  }),
  login: async () => true,
  signup: async () => true,
  loginWithGoogle: async () => true,
  loginWithGithub: async () => true,
  logout: async () => true,
};
export const resetPassword = async () => {};
export const updatePassword = async () => {};
