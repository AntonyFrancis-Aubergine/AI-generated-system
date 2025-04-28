export const MESSAGES = {
  REQUIRED: (field: string): string =>
    `${field} is required and cannot be empty`,

  NON_EMPTY: (field: string): string => `${field} cannot be empty`,

  INVALID: (field: string): string => `${field} is invalid`,

  CREATE_SUCCESS: (object: string): string => `${object} created successfully`,
  UPDATE_SUCCESS: (object: string): string => `${object} updated successfully`,
  RETRIEVE_SUCCESS: (object: string): string =>
    `${object} retrieved successfully`,
  ARCHIVE_SUCCESS: (object: string): string =>
    `${object} archived successfully`,
  DELETE_SUCCESS: (object: string): string => `${object} deleted successfully`,

  CREATE_FAILED: (object: string): string => `Failed to create ${object}`,
  UPDATE_FAILED: (object: string): string => `Failed to update ${object}`,
  RETRIEVE_FAILED: (object: string): string => `Failed to retrieve ${object}`,
  ARCHIVE_FAILED: (object: string): string => `Failed to archive ${object}`,

  NOT_FOUND: (object: string): string => `${object} not found`,

  EXISTS: (object: string): string => `${object} already exists`,
  NOT_EXISTS: (object: string): string => `${object} does not exist`,

  DATA_TYPE: (field: string, datatype: string): string =>
    `${field} must be ${datatype}`,

  NOT_POSITIVE: (object: string): string => `${object} must be positive`,

  NOT_EMPTY: (object: string): string => `${object} should not be empty`,

  MIN: (field: string, min: number): string =>
    `Minimum length should be ${min} for ${field}`,

  MAX: (field: string, max: number): string =>
    `Maximum length should be ${max} for ${field}`,

  REQUIRED_ONE_FIELD: 'At least one field is required',
  REQUIRED_ONE_VALUE: 'At least one value is required',

  ERROR: 'Something went wrong.',
  FORBIDDEN_MSG: 'Unauthorized access',
  LOG_OUT_SUCCESS: 'Logged out successfully',
  DATABASE_ERROR: 'Database Error',
  TOKEN_EXPIRED: 'Token has expired',
  USER_ARCHIVED: 'Login Failed, User is Archived',
  VALIDATION_ERR: 'Invalid Data',
  RATE_LIMIT_EXCEEDED: 'You have exceeded your request limit',

  // * Add API specific messages here
}

export const AUTH_MESSAGES = {
  LOGIN_SUCCESS: 'Login successful',
  LOGOUT_SUCCESS: 'Logout successful',
  INVALID_CREDENTIALS: 'Invalid email or password',
  UNAUTHORIZED: 'Unauthorized access',
  TOKEN_EXPIRED: 'Token has expired',
  TOKEN_INVALID: 'Invalid token',
  INVALID_ROLE: 'Invalid role',
  INSUFFICIENT_PERMISSIONS: 'Insufficient permissions'
} as const;

export const USER_MESSAGES = {
  CREATED: 'User created successfully',
  UPDATED: 'User updated successfully',
  DELETED: 'User deleted successfully',
  NOT_FOUND: 'User not found',
  EMAIL_EXISTS: 'Email already exists'
} as const;

export const TEAM_MESSAGES = {
  CREATED: 'Team created successfully',
  UPDATED: 'Team updated successfully',
  DELETED: 'Team deleted successfully',
  NOT_FOUND: 'Team not found',
  MEMBER_ADDED: 'Team member added successfully',
  MEMBER_REMOVED: 'Team member removed successfully',
  NAME_EXISTS: 'Team name already exists',
  MEMBER_EXISTS: 'User is already a team member'
} as const;

export const PROJECT_MESSAGES = {
  CREATED: 'Project created successfully',
  UPDATED: 'Project updated successfully',
  DELETED: 'Project deleted successfully',
  NOT_FOUND: 'Project not found',
  NAME_EXISTS: 'Project name already exists'
} as const;

export const SPRINT_MESSAGES = {
  CREATED: 'Sprint created successfully',
  UPDATED: 'Sprint updated successfully',
  DELETED: 'Sprint deleted successfully',
  NOT_FOUND: 'Sprint not found',
  INVALID_DATES: 'Invalid sprint dates',
  ACTIVE_SPRINT_EXISTS: 'Team already has an active sprint'
} as const;

export const TICKET_MESSAGES = {
  CREATED: 'Ticket created successfully',
  UPDATED: 'Ticket updated successfully',
  DELETED: 'Ticket deleted successfully',
  NOT_FOUND: 'Ticket not found',
  INVALID_STATUS: 'Invalid ticket status',
  INVALID_PRIORITY: 'Invalid ticket priority'
} as const;
