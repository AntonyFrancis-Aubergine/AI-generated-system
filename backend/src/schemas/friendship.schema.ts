import { z } from "zod";
import { FriendshipStatus } from "@prisma/client";

export const createFriendRequestSchema = z.object({
  receiverId: z.string().uuid({
    message: "Receiver ID must be a valid UUID",
  }),
});

export const updateFriendRequestSchema = z.object({
  status: z.nativeEnum(FriendshipStatus, {
    errorMap: () => ({
      message: `Status must be one of: ${Object.values(FriendshipStatus).join(
        ", "
      )}`,
    }),
  }),
});

export const friendshipFiltersSchema = z.object({
  status: z
    .nativeEnum(FriendshipStatus, {
      errorMap: () => ({
        message: `Status must be one of: ${Object.values(FriendshipStatus).join(
          ", "
        )}`,
      }),
    })
    .optional(),
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().optional().default(10),
});
