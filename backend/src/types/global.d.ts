import { JwtPayload } from './auth.types'

// Extend Express Request type to include user information
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload
    }
  }
}
