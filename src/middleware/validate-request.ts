import InvalidInputError from '@/errors/invalid-error';
import { NextFunction, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';

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
export const usernameValidation = body('username')
  .trim()
  .notEmpty()
  .withMessage('Username is required')
  .isLength({ min: 3, max: 32 })
  .withMessage('Username must be between 3 and 32 characters')
  .matches(/^[a-zA-Z0-9_.-]+$/)
  .withMessage(
    'Username can only contain letters, numbers, underscores, dots, and hyphens',
  );

export const emailValidation = body('email')
  .trim()
  .isEmail()
  .withMessage('Please provide a valid email address')
  .normalizeEmail();

export const passwordValidation = body('password')
  .trim()
  .isLength({ min: 6, max: 32 })
  .withMessage('Password must be between 6 and 32 characters')
  .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?![@<>'",]).{6,32}$/)
  .withMessage(
    'Password must contain at least one lowercase letter, one uppercase letter, and one number. Special characters @<>\'", are not allowed.',
  )
  .escape();

export const ValidateReturn = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return new InvalidInputError(errors.array());
  }
  return next();
};
