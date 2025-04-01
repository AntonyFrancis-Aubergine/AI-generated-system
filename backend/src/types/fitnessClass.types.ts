/**
 * Interface for creating a fitness class
 */
export interface CreateFitnessClassRequest {
  /**
   * Name of the fitness class
   */
  name: string

  /**
   * ID of the category
   */
  categoryId: string

  /**
   * ID of the instructor
   */
  instructorId: string

  /**
   * Start time of the class (ISO format)
   */
  startsAt: string

  /**
   * End time of the class (ISO format)
   */
  endsAt: string
}

/**
 * Interface for fitness class response
 */
export interface FitnessClassResponse {
  id: string
  name: string
  categoryId: string
  instructorId: string
  startsAt: Date
  endsAt: Date
  createdAt: Date
  updatedAt: Date

  // Relations
  category?: {
    id: string
    name: string
    description: string | null
  }

  instructor?: {
    id: string
    name: string
    email: string
    role: string
  }

  bookings?: Array<{
    id: string
    userId: string
    fitnessClassId: string
  }>
}

/**
 * Interface for fitness class filtering and searching
 */
export interface FitnessClassFilters {
  /**
   * Search by name
   */
  name?: string

  /**
   * Filter by category ID
   */
  categoryId?: string

  /**
   * Filter by instructor ID
   */
  instructorId?: string

  /**
   * Filter classes starting after this date (ISO format)
   */
  startDateFrom?: string

  /**
   * Filter classes starting before this date (ISO format)
   */
  startDateTo?: string
}

/**
 * Interface for fitness class query params
 */
export interface FitnessClassQueryParams extends FitnessClassFilters {
  /**
   * Page number for pagination
   */
  page?: string

  /**
   * Number of items per page
   */
  limit?: string
}
