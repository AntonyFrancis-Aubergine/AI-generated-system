import { Router } from "express";
import { UserController } from "../../controllers";
import { STATUS_CODES } from "../../utils/statusCodes";
import { APIResponse } from "../../utils/responseGenerator";

const router = Router();

/**
 * @route GET /api/admin/users
 * @desc Get all users with pagination and filtering
 * @access Private (Admin)
 */
router.get("/", (req, res, next) => {
  try {
    UserController.getAllUsers(req, res, next);
  } catch (error) {
    next(error);
  }
});

/**
 * @route GET /api/admin/users/:userId
 * @desc Get a specific user by ID
 * @access Private (Admin)
 */
router.get("/:userId", (req, res, next) => {
  try {
    UserController.getUserById(req, res, next);
  } catch (error) {
    next(error);
  }
});

/**
 * Note: These routes would be implemented in a real application
 * @route POST /api/admin/users
 * @desc Create a new user (Admin only)
 * @access Private (Admin)
 */
router.post("/", (req, res, _next) => {
  // This would call a controller method in a real app
  res.status(STATUS_CODES.SUCCESS.CREATED).json(
    APIResponse.sendSuccess({
      message: "User created successfully",
      data: { id: "new-user-id", ...req.body },
    })
  );
});

/**
 * @route PUT /api/admin/users/:userId
 * @desc Update a user (Admin only)
 * @access Private (Admin)
 */
router.put("/:userId", (req, res, _next) => {
  // This would call a controller method in a real app
  res.status(STATUS_CODES.SUCCESS.OK).json(
    APIResponse.sendSuccess({
      message: "User updated successfully",
      data: { id: req.params.userId, ...req.body },
    })
  );
});

/**
 * @route DELETE /api/admin/users/:userId
 * @desc Delete a user (Admin only)
 * @access Private (Admin)
 */
router.delete("/:userId", (_req, res, _next) => {
  // This would call a controller method in a real app
  res.status(STATUS_CODES.SUCCESS.OK).json(
    APIResponse.sendSuccess({
      message: "User deleted successfully",
      data: null,
    })
  );
});

export default router;
