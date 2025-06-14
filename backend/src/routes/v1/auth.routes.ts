import { Router } from 'express';
import { registerUser, loginUser, registerValidation, loginValidation } from '../../controllers/auth.controller';
import { validate } from '../../utils/validator';

const router = Router();

// Register route
router.post('/register', validate(registerValidation), registerUser);

// Login route
router.post('/login', validate(loginValidation), loginUser);

export default router; 