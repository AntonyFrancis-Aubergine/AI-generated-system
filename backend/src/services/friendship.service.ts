import { PrismaClient } from "@prisma/client";
import { APIError } from "../utils/customError";
import { STATUS_CODES } from "../utils/statusCodes";
import { MESSAGES } from "../utils/messages";
import {
  FriendshipFilters,
  FriendshipWithUserDetails,
} from "../types/friendship.types";

// Import FriendshipStatus from our types instead of Prisma
import { FriendshipStatus } from "../types/friendship.types";

const prisma = new PrismaClient();

/**
 * Create a new friend request
 */
export const createFriendRequest = async (
  senderId: string,
  receiverId: string
): Promise<FriendshipWithUserDetails> => {
  // Check if users exist
  const [sender, receiver] = await Promise.all([
    prisma.user.findUnique({ where: { id: senderId } }),
    prisma.user.findUnique({ where: { id: receiverId } }),
  ]);

  if (!sender) {
    throw new APIError(
      STATUS_CODES.CLIENT_ERROR.NOT_FOUND,
      MESSAGES.NOT_FOUND("Sender user"),
      true
    );
  }

  if (!receiver) {
    throw new APIError(
      STATUS_CODES.CLIENT_ERROR.NOT_FOUND,
      MESSAGES.NOT_FOUND("Receiver user"),
      true
    );
  }

  // Prevent self-friendship
  if (senderId === receiverId) {
    throw new APIError(
      STATUS_CODES.CLIENT_ERROR.BAD_REQUEST,
      "You cannot send a friend request to yourself",
      true
    );
  }

  // Check if a friendship already exists
  const existingFriendship = await prisma.userFriendship.findUnique({
    where: {
      senderId_receiverId: {
        senderId,
        receiverId,
      },
    },
  });

  if (existingFriendship) {
    throw new APIError(
      STATUS_CODES.CLIENT_ERROR.BAD_REQUEST,
      "A friend request already exists between these users",
      true
    );
  }

  // Check for reverse friendship
  const reverseExistingFriendship = await prisma.userFriendship.findUnique({
    where: {
      senderId_receiverId: {
        senderId: receiverId,
        receiverId: senderId,
      },
    },
  });

  if (reverseExistingFriendship) {
    throw new APIError(
      STATUS_CODES.CLIENT_ERROR.BAD_REQUEST,
      "There is already a friend request from the other user",
      true
    );
  }

  // Create a new friend request
  return prisma.userFriendship.create({
    data: {
      senderId,
      receiverId,
      status: FriendshipStatus.PENDING,
    },
    include: {
      sender: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      receiver: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
};

/**
 * Get all friendships for a user
 */
export const getUserFriendships = async (
  userId: string,
  filters: FriendshipFilters
): Promise<{
  data: FriendshipWithUserDetails[];
  meta: { total: number; page: number; limit: number; totalPages: number };
}> => {
  const { status, page = 1, limit = 10 } = filters;

  const skip = (page - 1) * limit;

  const where = {
    OR: [
      {
        senderId: userId,
      },
      {
        receiverId: userId,
      },
    ],
    ...(status && { status }),
  };

  const [friendships, total] = await Promise.all([
    prisma.userFriendship.findMany({
      where,
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        receiver: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: limit,
    }),
    prisma.userFriendship.count({ where }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    data: friendships,
    meta: {
      total,
      page,
      limit,
      totalPages,
    },
  };
};

/**
 * Get pending friend requests received by a user
 */
export const getPendingFriendRequests = async (
  userId: string,
  page = 1,
  limit = 10
): Promise<{
  data: FriendshipWithUserDetails[];
  meta: { total: number; page: number; limit: number; totalPages: number };
}> => {
  const skip = (page - 1) * limit;

  const where = {
    receiverId: userId,
    status: FriendshipStatus.PENDING,
  };

  const [friendships, total] = await Promise.all([
    prisma.userFriendship.findMany({
      where,
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        receiver: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: limit,
    }),
    prisma.userFriendship.count({ where }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    data: friendships,
    meta: {
      total,
      page,
      limit,
      totalPages,
    },
  };
};

/**
 * Get a specific friendship by ID
 */
export const getFriendshipById = async (
  friendshipId: string,
  userId: string
): Promise<FriendshipWithUserDetails> => {
  const friendship = await prisma.userFriendship.findUnique({
    where: {
      id: friendshipId,
    },
    include: {
      sender: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      receiver: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  if (!friendship) {
    throw new APIError(
      STATUS_CODES.CLIENT_ERROR.NOT_FOUND,
      MESSAGES.NOT_FOUND("Friendship"),
      true
    );
  }

  // Ensure user is part of this friendship
  if (friendship.senderId !== userId && friendship.receiverId !== userId) {
    throw new APIError(
      STATUS_CODES.CLIENT_ERROR.FORBIDDEN,
      MESSAGES.FORBIDDEN,
      true
    );
  }

  return friendship;
};

/**
 * Update a friendship status (accept/reject)
 */
export const updateFriendshipStatus = async (
  friendshipId: string,
  userId: string,
  status: FriendshipStatus
): Promise<FriendshipWithUserDetails> => {
  // Check if friendship exists and user is the receiver
  const friendship = await prisma.userFriendship.findUnique({
    where: {
      id: friendshipId,
    },
  });

  if (!friendship) {
    throw new APIError(
      STATUS_CODES.CLIENT_ERROR.NOT_FOUND,
      MESSAGES.NOT_FOUND("Friendship"),
      true
    );
  }

  // Only the recipient can update the status
  if (friendship.receiverId !== userId) {
    throw new APIError(
      STATUS_CODES.CLIENT_ERROR.FORBIDDEN,
      "Only the recipient can accept or reject a friend request",
      true
    );
  }

  // Ensure friendship is in PENDING state
  if (friendship.status !== FriendshipStatus.PENDING) {
    throw new APIError(
      STATUS_CODES.CLIENT_ERROR.BAD_REQUEST,
      "This friend request has already been processed",
      true
    );
  }

  // Update the friendship status
  return prisma.userFriendship.update({
    where: {
      id: friendshipId,
    },
    data: {
      status,
    },
    include: {
      sender: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      receiver: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
};

/**
 * Delete a friendship/friend request
 */
export const deleteFriendship = async (
  friendshipId: string,
  userId: string
): Promise<void> => {
  // Check if friendship exists and user is part of it
  const friendship = await prisma.userFriendship.findUnique({
    where: {
      id: friendshipId,
    },
  });

  if (!friendship) {
    throw new APIError(
      STATUS_CODES.CLIENT_ERROR.NOT_FOUND,
      MESSAGES.NOT_FOUND("Friendship"),
      true
    );
  }

  // Only users who are part of the friendship can delete it
  if (friendship.senderId !== userId && friendship.receiverId !== userId) {
    throw new APIError(
      STATUS_CODES.CLIENT_ERROR.FORBIDDEN,
      MESSAGES.FORBIDDEN,
      true
    );
  }

  // Delete the friendship
  await prisma.userFriendship.delete({
    where: {
      id: friendshipId,
    },
  });
};
