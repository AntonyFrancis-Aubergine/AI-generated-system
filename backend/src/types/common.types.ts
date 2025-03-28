import { z } from 'zod'

// Pagination request schema
export const PaginationParamsSchema = z.object({
  page: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 1)),
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : undefined)),
})

// Pagination request type
export type PaginationParams = z.infer<typeof PaginationParamsSchema>

// Pagination metadata for response
export interface PaginationMeta {
  currentPage: number
  pageSize: number
  totalPages: number
  totalItems: number
}

// Generic paginated response interface
export interface PaginatedResponse<T> {
  data: T[]
  meta: PaginationMeta
}
