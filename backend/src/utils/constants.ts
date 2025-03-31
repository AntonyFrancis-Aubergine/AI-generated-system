export const CONSTANTS = {
  // * Pagination constants
  PAGINATION_LIMIT: 10,

  // Authentication constants
  AUTH: {
    ACCESS_TOKEN_EXPIRY: '1h', // 1 hour expiry for access token
    REFRESH_TOKEN_EXPIRY: '7d', // 7 days expiry for refresh token
    PASSWORD_SALT_ROUNDS: 10, // Salt rounds for bcrypt
  },

  // Vehicle constants
  VEHICLE: {
    MIN_YEAR: 2010, // Minimum allowed vehicle year
    MAX_SEATING_CAPACITY: 50, // Maximum allowed seating capacity
  },

  // Driver constants
  DRIVER: {
    MIN_EXPERIENCE_YEARS: 0,
    MAX_EXPERIENCE_YEARS: 50,
    MIN_RATING: 0,
    MAX_RATING: 5,
  },
}
