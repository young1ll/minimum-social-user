import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';

const signUpRouter = express.Router();
export const SIGNUP_ROUTE = '/api/auth/signup';

signUpRouter.post(
  SIGNUP_ROUTE,
  [
    body('email').trim().isEmail().withMessage('Email must be valid'),
    body('password')
      .trim()
      .isLength({ min: 6, max: 32 })
      .withMessage('Password must be between 6 and 32 characters'),
    body('password')
      .matches(/^(.*[a-z].*)$/)
      .withMessage('Password must contain at least one lowercase character'),
    body('password')
      .matches(/^(.*[A-Z].*)$/)
      .withMessage('Password must contain at least one uppercase character'),
    body('password')
      .matches(/^(.*\d.*)$/)
      .withMessage('Password must contain at least one number'),
  ],
  (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(422).send({});
    }
    res.send({});
  },
);

export default signUpRouter;
