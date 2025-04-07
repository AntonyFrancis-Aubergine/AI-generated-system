import { Router } from "express";
import { FriendshipController } from "../../controllers";
import { authenticate } from "../../middlewares/auth.middleware";
import { validateRequest } from "../../middlewares/validation.middleware";
import {
  createFriendRequestSchema,
  // No need to import updateFriendRequestSchema if unused
} from "../../schemas/friendship.schema";

const router = Router();

// Apply authentication middleware to all friendship routes
router.use(authenticate);

/**
 * @route GET /api/v1/friendships
 * @description Get all friendships for the authenticated user
 * @access Private
 */
router.get("/", (req, res, next) => {
  try {
    FriendshipController.getUserFriendships(req, res);
  } catch (error) {
    next(error);
  }
});

/**
 * @route GET /api/v1/friendships/requests
 * @description Get pending friend requests for the authenticated user
 * @access Private
 */
router.get("/requests", (req, res, next) => {
  try {
    FriendshipController.getPendingFriendRequests(req, res);
  } catch (error) {
    next(error);
  }
});

/**
 * @route POST /api/v1/friendships/requests
 * @description Send a friend request to another user
 * @access Private
 */
router.post(
  "/requests",
  validateRequest({ body: createFriendRequestSchema }),
  (req, res, next) => {
    try {
      FriendshipController.sendFriendRequest(req, res);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @route GET /api/v1/friendships/:id
 * @description Get a specific friendship by ID
 * @access Private
 */
router.get("/:id", (req, res, next) => {
  try {
    FriendshipController.getFriendshipById(req, res);
  } catch (error) {
    next(error);
  }
});

/**
 * @route PUT /api/v1/friendships/:id/accept
 * @description Accept a friend request
 * @access Private
 */
router.put("/:id/accept", (req, res, next) => {
  try {
    FriendshipController.acceptFriendRequest(req, res);
  } catch (error) {
    next(error);
  }
});

/**
 * @route PUT /api/v1/friendships/:id/reject
 * @description Reject a friend request
 * @access Private
 */
router.put("/:id/reject", (req, res, next) => {
  try {
    FriendshipController.rejectFriendRequest(req, res);
  } catch (error) {
    next(error);
  }
});

/**
 * @route DELETE /api/v1/friendships/:id
 * @description Delete a friendship
 * @access Private
 */
router.delete("/:id", (req, res, next) => {
  try {
    FriendshipController.deleteFriendship(req, res);
  } catch (error) {
    next(error);
  }
});

export default router;
