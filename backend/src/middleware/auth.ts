import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { CustomError } from './errorHandler';

interface JwtPayload {
  isAdmin: boolean;
}

declare global {
  namespace Express {
    interface Request {
      isAdmin?: boolean;
    }
  }
}

export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      const error: CustomError = new Error('Authentication required');
      error.statusCode = 401;
      throw error;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    
    if (!decoded.isAdmin) {
      const error: CustomError = new Error('Admin access required');
      error.statusCode = 403;
      throw error;
    }

    req.isAdmin = true;
    next();
  } catch (error) {
    if (error instanceof Error) {
      const customError: CustomError = error;
      customError.statusCode = customError.statusCode || 401;
      next(customError);
    } else {
      next(new Error('Authentication failed'));
    }
  }
}; 