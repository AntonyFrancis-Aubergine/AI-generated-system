/**
 * Format a date to display in a user-friendly format
 * @param dateString ISO date string or Date object
 * @returns Formatted date string (e.g., "Monday, March 15, 2023")
 */
export function formatDate(dateString: string | Date): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Format a time to display in a user-friendly format
 * @param dateString ISO date string or Date object
 * @returns Formatted time string (e.g., "2:30 PM")
 */
export function formatTime(dateString: string | Date): string {
  const date = new Date(dateString);
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

/**
 * Format a date to ISO string format for API requests
 * @param date Date object
 * @returns ISO string format
 */
export function toISOString(date: Date): string {
  return date.toISOString();
}

/**
 * Calculate duration between two dates in minutes
 * @param startDate Start date
 * @param endDate End date
 * @returns Duration in minutes
 */
export function getDurationInMinutes(startDate: Date, endDate: Date): number {
  const diffMs = endDate.getTime() - startDate.getTime();
  return Math.round(diffMs / 60000);
}

/**
 * Format duration in a user-friendly way
 * @param minutes Duration in minutes
 * @returns Formatted duration string (e.g., "1 hour 30 minutes")
 */
export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours === 0) {
    return `${remainingMinutes} minute${remainingMinutes !== 1 ? "s" : ""}`;
  } else if (remainingMinutes === 0) {
    return `${hours} hour${hours !== 1 ? "s" : ""}`;
  } else {
    return `${hours} hour${hours !== 1 ? "s" : ""} ${remainingMinutes} minute${
      remainingMinutes !== 1 ? "s" : ""
    }`;
  }
}

/**
 * Check if a date is in the past
 * @param date Date to check
 * @returns True if the date is in the past
 */
export function isPastDate(date: Date): boolean {
  const now = new Date();
  return date < now;
}

/**
 * Get a date n days from now
 * @param days Number of days to add (can be negative)
 * @returns Date object
 */
export function getDateRelativeToToday(days: number): Date {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
}
