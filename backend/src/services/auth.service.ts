import jwt from 'jsonwebtoken';
import type { SignOptions } from 'jsonwebtoken';
import { User, IUser } from '../models';
import { AppError } from '../utils/errorHandler';
import { AUTH_MESSAGES, USER_MESSAGES } from '../utils/messages';
import { ROLES } from '../utils/constants';
import { HydratedDocument, Types } from 'mongoose';

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

export const register = async (data: RegisterData) => {
  const { email, password, name, role } = data;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError(USER_MESSAGES.EMAIL_EXISTS, 400);
  }

  // Create new user
  const user: HydratedDocument<IUser> = await User.create({
    email,
    password,
    name,
    role
  });

  // Generate token
  const token = generateToken((user._id as Types.ObjectId).toString(), user.role);

  return {
    user: {
      id: (user._id as Types.ObjectId).toString(),
      email: user.email,
      name: user.name,
      role: user.role
    },
    token
  };
};

export const login = async (data: LoginData) => {
  const { email, password } = data;

  // Find user
  const user: HydratedDocument<IUser> | null = await User.findOne({ email });
  if (!user) {
    throw new AppError(AUTH_MESSAGES.INVALID_CREDENTIALS, 401);
  }

  // Check password
  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    throw new AppError(AUTH_MESSAGES.INVALID_CREDENTIALS, 401);
  }

  // Generate token
  const token = generateToken((user._id as Types.ObjectId).toString(), user.role);

  return {
    user: {
      id: (user._id as Types.ObjectId).toString(),
      email: user.email,
      name: user.name,
      role: user.role
    },
    token
  };
};

const generateToken = (userId: string, role: typeof ROLES[keyof typeof ROLES]) => {
  const payload: TokenPayload = { userId, role };
  const secret = process.env.JWT_SECRET as string;
  const options: SignOptions = { 
    expiresIn: '24h',
    algorithm: 'HS256'
  };

  return jwt.sign(payload, secret, options);
}; 