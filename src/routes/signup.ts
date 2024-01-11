import { SignUpController } from '@/controllers';
import { Router } from 'express';
import { body } from 'express-validator';

export const SIGNUP_ROUTE = '/api/auth/signup';
const SignUpRouter = Router();

/**
 * 회원가입 유효성 검사:
 *
 * - Username:
 *   - Must not be empty
 *   - Must be between 3 and 32 characters
 *   - Can only contain letters, numbers, underscores, dots, and hyphens
 *
 * - Email:
 *   - Must be in a valid email format
 *   - Must normalize the email (sanitize)
 *
 * - Password:
 *   - Must be between 6 and 32 characters
 *   - Must contain at least one lowercase letter
 *   - Must contain at least one uppercase letter
 *   - Must contain at least one number
 *   - Must not contain spaces and special characters [><"'']
 */
const usernameValidation = body('username')
  .trim()
  .notEmpty()
  .withMessage('Username is required')
  .isLength({ min: 3, max: 32 })
  .withMessage('Username must be between 3 and 32 characters')
  .matches(/^[a-zA-Z0-9_.-]+$/)
  .withMessage(
    'Username can only contain letters, numbers, underscores, dots, and hyphens',
  );

const emailValidation = body('email')
  .trim()
  .isEmail()
  .withMessage('Please provide a valid email address')
  .normalizeEmail();

const passwordValidation = body('password')
  .trim()
  .isLength({ min: 6, max: 32 })
  .withMessage('Password must be between 6 and 32 characters')
  .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?![@<>'",]).{6,32}$/)
  .withMessage(
    'Password must contain at least one lowercase letter, one uppercase letter, and one number. Special characters @<>\'", are not allowed.',
  )
  .escape();

SignUpRouter.post(
  SIGNUP_ROUTE,
  [usernameValidation, emailValidation, passwordValidation],
  SignUpController,
);

export default SignUpRouter;
