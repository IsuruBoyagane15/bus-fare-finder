import express, { NextFunction, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import { CustomError } from '../middleware/errorHandler';
import User from '../models/User';
import { requireAdmin } from '../middleware/auth';

const router = express.Router();

// Validation middleware
const loginValidation = [
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('password').notEmpty().withMessage('Password is required'),
];

const changePasswordValidation = [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters long'),
];

// Admin login route
router.post('/login', loginValidation, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error: CustomError = new Error('Validation failed');
      error.statusCode = 400;
      throw error;
    }

    const { email, password } = req.body;

    // Find user in database
    const user = await User.findOne({ email });
    if (!user || user.role !== 'admin') {
      const error: CustomError = new Error('Invalid credentials');
      error.statusCode = 401;
      throw error;
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      const error: CustomError = new Error('Invalid credentials');
      error.statusCode = 401;
      throw error;
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, isAdmin: true },
      process.env.JWT_SECRET!,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      message: 'Login successful',
    });
  } catch (error) {
    next(error);
  }
});

// Change admin password route
router.post(
  '/change-password',
  requireAdmin,
  changePasswordValidation,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const error: CustomError = new Error('Validation failed');
        error.statusCode = 400;
        throw error;
      }

      const { currentPassword, newPassword } = req.body;

      // Find admin user
      const admin = await User.findOne({ role: 'admin' });
      if (!admin) {
        const error: CustomError = new Error('Admin user not found');
        error.statusCode = 404;
        throw error;
      }

      // Verify current password
      const isPasswordValid = await admin.comparePassword(currentPassword);
      if (!isPasswordValid) {
        const error: CustomError = new Error('Current password is incorrect');
        error.statusCode = 401;
        throw error;
      }

      // Update password
      admin.password = newPassword;
      await admin.save();

      res.json({
        message: 'Password updated successfully',
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router; 