import { z } from 'zod'
import { UserRole } from '@prisma/client'

// User list query params schema
export const UserListQuerySchema = z.object({
  name: z.string().optional(),
  email: z.string().optional(),
  role: z.nativeEnum(UserRole).optional(),
  isActive: z
    .string()
    .optional()
    .transform((val) => {
      if (val === 'true') return true
      if (val === 'false') return false
      return undefined
    }),
})

// User list query params type
export type UserListQueryParams = z.infer<typeof UserListQuerySchema>

// User list response type
export interface UserListItem {
  id: string
  name: string
  email: string
  role: UserRole
  contactNumber: string | null
  profileImageUrl: string | null
  isActive: boolean
  createdAt: Date
}
