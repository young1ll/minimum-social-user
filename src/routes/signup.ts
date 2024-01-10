import { SignUpController } from '@/controllers/auth-controller';
import { User } from '@/models';
import e, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';

const SignUpRouter = e.Router();
export const SIGNUP_ROUTE = '/api/auth/signup';

SignUpRouter.get(SIGNUP_ROUTE, (req: Request, res: Response) => {
  res.send({ message: 'minimum-socials auth-server is running' });
});

SignUpRouter.post(
  SIGNUP_ROUTE,
  [
    body('username'),
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
