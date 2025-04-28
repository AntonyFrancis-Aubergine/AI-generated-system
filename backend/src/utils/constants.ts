export const CONSTANTS = {
  // * Add your constants here
};

export const ROLES = {
  SCRUM_MASTER: 'SCRUM_MASTER',
  DEVELOPER: 'DEVELOPER',
} as const;

export const TICKET_PRIORITY = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
} as const;

export const TICKET_STATUS = {
  BACKLOG: 'BACKLOG',
  READY: 'READY',
  IN_PROGRESS: 'IN_PROGRESS',
  REVIEW: 'REVIEW',
  DONE: 'DONE',
} as const;

export const SPRINT_STATUS = {
  PLANNED: 'PLANNED',
  ACTIVE: 'ACTIVE',
  COMPLETED: 'COMPLETED',
  ARCHIVED: 'ARCHIVED',
} as const;

export const DEFAULT_BOARD_COLUMNS = [
  { name: TICKET_STATUS.BACKLOG, order: 0 },
  { name: TICKET_STATUS.READY, order: 1 },
  { name: TICKET_STATUS.IN_PROGRESS, order: 2 },
  { name: TICKET_STATUS.REVIEW, order: 3 },
  { name: TICKET_STATUS.DONE, order: 4 },
];
