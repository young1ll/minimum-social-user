import { SignUpController } from '@/controllers';
import { Router } from 'express';
import { body } from 'express-validator';

export const SIGNUP_ROUTE = '/api/auth/signup';
const SignUpRouter = Router();

SignUpRouter.post(
  SIGNUP_ROUTE,
  [
    body('username').trim(),
    body('email')
      .trim()
      .isEmail()
      .withMessage('Please provide a valid email address')
      .normalizeEmail(),
    body('password')
      .trim()
      .isLength({ min: 6, max: 32 })
      .withMessage('Password must be between 6 and 32 characters')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,32}$/)
      .withMessage(
        'Password must contain at least one lowercase letter, one uppercase letter, and one number',
      )
      .escape(),
  ],
  SignUpController,
);

export default SignUpRouter;
