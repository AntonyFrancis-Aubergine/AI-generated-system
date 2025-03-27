export const CONSTANTS = {
  // * Pagination constants
  PAGINATION_LIMIT: 10,

  // Authentication constants
  AUTH: {
    ACCESS_TOKEN_EXPIRY: '1h', // 1 hour expiry for access token
    REFRESH_TOKEN_EXPIRY: '7d', // 7 days expiry for refresh token
    PASSWORD_SALT_ROUNDS: 10, // Salt rounds for bcrypt
  },
}
