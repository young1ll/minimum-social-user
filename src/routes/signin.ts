import { ValidateReturn } from '@/middleware';
import {
  emailValidation,
  passwordValidation,
} from '@/middleware/validate-request';
import { Response, Request, Router } from 'express';

export const SIGNIN_ROUTE = '/api/auth/signin';
const SignInRouter = Router();

SignInRouter.post(
  SIGNIN_ROUTE,
  [emailValidation, passwordValidation],
  ValidateReturn,
  (req: Request, res: Response) => {
    res.send({
      message: 'signin',
    });
  },
);

export default SignInRouter;
