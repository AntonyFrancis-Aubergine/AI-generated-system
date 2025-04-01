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
