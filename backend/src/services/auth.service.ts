import jwt from 'jsonwebtoken';
import type { SignOptions } from 'jsonwebtoken';
import { User, IUser } from '../models';
import { AppError } from '../utils/errorHandler';
import { AUTH_MESSAGES, USER_MESSAGES } from '../utils/messages';
import { ROLES } from '../utils/constants';
import { HydratedDocument, Types } from 'mongoose';
import bcrypt from 'bcryptjs';
import { generateToken as generateJWTToken } from '../utils/jwt';

interface RegisterData {
  email: string;
  password: string;
  name: string;
  role: typeof ROLES[keyof typeof ROLES];
}

interface LoginData {
  email: string;
  password: string;
}

interface TokenPayload {
  userId: string;
  role: typeof ROLES[keyof typeof ROLES];
}

export const register = async (userData: {
  email: string;
  password: string;
  name: string;
  role: string;
}) => {
  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      throw new AppError(AUTH_MESSAGES.EMAIL_ALREADY_EXISTS, 400);
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);

    // Create user
    const user = await User.create({
      ...userData,
      password: hashedPassword,
    });

    // Generate token
    const token = generateJWTToken((user._id as Types.ObjectId).toString(), user.role as 'SCRUM_MASTER' | 'DEVELOPER');

    return {
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      token,
    };
  } catch (error) {
    throw error;
  }
};

export const login = async (credentials: { email: string; password: string }) => {
  try {
    // Find user
    const user = await User.findOne({ email: credentials.email });
    if (!user) {
      throw new AppError(AUTH_MESSAGES.INVALID_CREDENTIALS, 401);
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
    if (!isPasswordValid) {
      throw new AppError(AUTH_MESSAGES.INVALID_CREDENTIALS, 401);
    }

    // Generate token
    const token = generateJWTToken((user._id as Types.ObjectId).toString(), user.role as 'SCRUM_MASTER' | 'DEVELOPER');

    return {
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      token,
    };
  } catch (error) {
    throw error;
  }
};

const generateAuthToken = (userId: string, role: typeof ROLES[keyof typeof ROLES]) => {
  const payload: TokenPayload = { userId, role };
  const secret = process.env.JWT_SECRET as string;
  const options: SignOptions = { 
    expiresIn: '24h',
    algorithm: 'HS256'
  };

  return jwt.sign(payload, secret, options);
}; 