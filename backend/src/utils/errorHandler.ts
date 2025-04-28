import { Request, Response, NextFunction } from 'express';

export class AppError extends Error {
  statusCode: number;
  status: string;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack
    });
  } else {
    // Production mode
    if (err.isOperational) {
      res.status(err.statusCode).json({
        status: err.status,
        message: err.message
      });
    } else {
      // Programming or unknown error: don't leak error details
      console.error('ERROR 💥', err);
      res.status(500).json({
        status: 'error',
        message: 'Something went wrong!'
      });
    }
  }
};

interface User {
  _id: string;
  username: string;
  email: string;
  password: string;
  role: 'admin' | 'agent' | 'customer';
  createdAt: Date;
  updatedAt: Date;
}

interface Ticket {
  _id: string;
  title: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  createdBy: string; // User ID
  assignedTo?: string; // User ID
  category: string;
  createdAt: Date;
  updatedAt: Date;
  resolution?: string;
  dueDate?: Date;
}

interface Comment {
  _id: string;
  ticketId: string;
  userId: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

const authenticate = (req: Request, res: Response, next: NextFunction) => {
  // JWT token verification
  // Role-based access control
};

const validateTicket = (req: Request, res: Response, next: NextFunction) => {
  // Validate ticket creation/update data
}; 