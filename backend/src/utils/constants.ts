export const CONSTANTS = {
  // * Add your constants here
  HEALTH: {
    STATUS: {
      OK: 'OK',
      ERROR: 'ERROR',
    },
  },
  AUTH: {
    JWT: {
      SECRET: process.env.JWT_SECRET || 'your-secret-key',
      EXPIRES_IN: '24h',
    },
    SALT_ROUNDS: 10,
    ROLES: {
      USER: 'USER',
      INSTRUCTOR: 'INSTRUCTOR',
      ADMIN: 'ADMIN',
    },
  },
}
