export * as HealthTypes from './health.types'
export * as AuthTypes from './auth.types'
export * as FitnessClassTypes from './fitnessClass.types'
export * as BookingTypes from './fitnessClassBooking.types'
export * as InstructorTypes from './instructor.types'

export interface Pagination {
  page: number
  limit: number
}

export interface PaginationMeta {
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}

export interface PaginatedResult<T> {
  data: T[]
  meta: PaginationMeta
}
