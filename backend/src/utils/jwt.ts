import jwt from 'jsonwebtoken';
import type { SignOptions } from 'jsonwebtoken';
import { AUTH_MESSAGES } from './messages';

export const generateToken = (userId: string, role: string): string => {
  const payload = { userId, role };
  const secret = process.env.JWT_SECRET;
  
  if (!secret) {
    throw new Error(AUTH_MESSAGES.JWT_SECRET_MISSING);
  }

  const options: SignOptions = {
    expiresIn: '24h',
    algorithm: 'HS256'
  };

  return jwt.sign(payload, secret, options);
};

export const verifyToken = (token: string): { userId: string; role: string } => {
  const secret = process.env.JWT_SECRET;
  
  if (!secret) {
    throw new Error(AUTH_MESSAGES.JWT_SECRET_MISSING);
  }

  try {
    return jwt.verify(token, secret) as { userId: string; role: string };
  } catch (error) {
    throw new Error(AUTH_MESSAGES.UNAUTHORIZED);
  }
}; 