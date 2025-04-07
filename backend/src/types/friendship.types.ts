import { FriendshipStatus } from "@prisma/client";

// Re-export the FriendshipStatus enum
export { FriendshipStatus };

export interface CreateFriendRequestDto {
  receiverId: string;
}

export interface UpdateFriendRequestDto {
  status: FriendshipStatus;
}

export interface FriendshipFilters {
  status?: FriendshipStatus;
  page?: number;
  limit?: number;
}

export interface FriendshipWithUserDetails {
  id: string;
  status: FriendshipStatus;
  senderId: string;
  receiverId: string;
  createdAt: Date;
  updatedAt: Date;
  sender: {
    id: string;
    name: string;
    email: string;
  };
  receiver: {
    id: string;
    name: string;
    email: string;
  };
}
