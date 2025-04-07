import { Request, Response } from "express";
import { FriendshipService } from "../services";
import { APIResponse } from "../utils/responseGenerator";
import { MESSAGES } from "../utils/messages";
import {
  CreateFriendRequestDto,
  FriendshipFilters,
} from "../types/friendship.types";
import {
  createFriendRequestSchema,
  friendshipFiltersSchema,
} from "../schemas/friendship.schema";
import { FriendshipStatus } from "@prisma/client";

/**
 * Send a friend request to another user
 * @route POST /api/v1/friendships/requests
 * @access Private
 */
export const sendFriendRequest = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json(
        APIResponse.sendError({
          message: MESSAGES.UNAUTHORIZED,
        })
      );
    }

    // Validate request body
    const validatedData = createFriendRequestSchema.parse(
      req.body
    ) as CreateFriendRequestDto;

    const friendship = await FriendshipService.createFriendRequest(
      userId,
      validatedData.receiverId
    );

    return res.status(201).json(
      APIResponse.sendSuccess({
        message: "Friend request sent successfully",
        data: friendship,
      })
    );
  } catch (error) {
    throw error;
  }
};

/**
 * Get all friendships for the authenticated user
 * @route GET /api/v1/friendships
 * @access Private
 */
export const getUserFriendships = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json(
        APIResponse.sendError({
          message: MESSAGES.UNAUTHORIZED,
        })
      );
    }

    // Parse and validate query parameters
    const filters = friendshipFiltersSchema.parse({
      status: req.query.status,
      page: req.query.page,
      limit: req.query.limit,
    }) as FriendshipFilters;

    const result = await FriendshipService.getUserFriendships(userId, filters);

    return res.status(200).json(
      APIResponse.sendSuccess({
        message: MESSAGES.RETRIEVE_SUCCESS("Friendships"),
        data: result.data,
        extra: { pagination: result.meta },
      })
    );
  } catch (error) {
    throw error;
  }
};

/**
 * Get pending friend requests for the authenticated user
 * @route GET /api/v1/friendships/requests
 * @access Private
 */
export const getPendingFriendRequests = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json(
        APIResponse.sendError({
          message: MESSAGES.UNAUTHORIZED,
        })
      );
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const result = await FriendshipService.getPendingFriendRequests(
      userId,
      page,
      limit
    );

    return res.status(200).json(
      APIResponse.sendSuccess({
        message: MESSAGES.RETRIEVE_SUCCESS("Friend requests"),
        data: result.data,
        extra: { pagination: result.meta },
      })
    );
  } catch (error) {
    throw error;
  }
};

/**
 * Get a specific friendship by ID
 * @route GET /api/v1/friendships/:id
 * @access Private
 */
export const getFriendshipById = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const friendshipId = req.params.id;

    if (!userId) {
      return res.status(401).json(
        APIResponse.sendError({
          message: MESSAGES.UNAUTHORIZED,
        })
      );
    }

    if (!friendshipId) {
      return res.status(400).json(
        APIResponse.sendError({
          message: MESSAGES.REQUIRED("Friendship ID"),
        })
      );
    }

    const friendship = await FriendshipService.getFriendshipById(
      friendshipId,
      userId
    );

    return res.status(200).json(
      APIResponse.sendSuccess({
        message: MESSAGES.RETRIEVE_SUCCESS("Friendship"),
        data: friendship,
      })
    );
  } catch (error) {
    throw error;
  }
};

/**
 * Accept a friend request
 * @route PUT /api/v1/friendships/:id/accept
 * @access Private
 */
export const acceptFriendRequest = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const friendshipId = req.params.id;

    if (!userId) {
      return res.status(401).json(
        APIResponse.sendError({
          message: MESSAGES.UNAUTHORIZED,
        })
      );
    }

    if (!friendshipId) {
      return res.status(400).json(
        APIResponse.sendError({
          message: MESSAGES.REQUIRED("Friendship ID"),
        })
      );
    }

    const friendship = await FriendshipService.updateFriendshipStatus(
      friendshipId,
      userId,
      FriendshipStatus.ACCEPTED
    );

    return res.status(200).json(
      APIResponse.sendSuccess({
        message: "Friend request accepted",
        data: friendship,
      })
    );
  } catch (error) {
    throw error;
  }
};

/**
 * Reject a friend request
 * @route PUT /api/v1/friendships/:id/reject
 * @access Private
 */
export const rejectFriendRequest = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const friendshipId = req.params.id;

    if (!userId) {
      return res.status(401).json(
        APIResponse.sendError({
          message: MESSAGES.UNAUTHORIZED,
        })
      );
    }

    if (!friendshipId) {
      return res.status(400).json(
        APIResponse.sendError({
          message: MESSAGES.REQUIRED("Friendship ID"),
        })
      );
    }

    const friendship = await FriendshipService.updateFriendshipStatus(
      friendshipId,
      userId,
      FriendshipStatus.REJECTED
    );

    return res.status(200).json(
      APIResponse.sendSuccess({
        message: "Friend request rejected",
        data: friendship,
      })
    );
  } catch (error) {
    throw error;
  }
};

/**
 * Delete a friendship
 * @route DELETE /api/v1/friendships/:id
 * @access Private
 */
export const deleteFriendship = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const friendshipId = req.params.id;

    if (!userId) {
      return res.status(401).json(
        APIResponse.sendError({
          message: MESSAGES.UNAUTHORIZED,
        })
      );
    }

    if (!friendshipId) {
      return res.status(400).json(
        APIResponse.sendError({
          message: MESSAGES.REQUIRED("Friendship ID"),
        })
      );
    }

    await FriendshipService.deleteFriendship(friendshipId, userId);

    return res.status(200).json(
      APIResponse.sendSuccess({
        message: "Friendship deleted successfully",
      })
    );
  } catch (error) {
    throw error;
  }
};
