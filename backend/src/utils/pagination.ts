import { PaginatedResponse } from '../types/common.types'

/**
 * Format a paginated response according to the project's standard API response format
 * @param paginatedData The paginated data from service layer
 * @returns Formatted response with data and pagination metadata separated
 */
export const formatPaginatedResponse = <T>(
  paginatedData: PaginatedResponse<T>
): {
  data: T[]
  pagination: {
    currentPage: number
    pageSize: number
    totalPages: number
    totalItems: number
  }
} => {
  return {
    data: paginatedData.data,
    pagination: paginatedData.meta,
  }
}
