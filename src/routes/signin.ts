import { ValidateReturn } from '@/middleware';
import {
  emailValidation,
  passwordValidation,
} from '@/middleware/validate-request';
import { SIGNIN_ROUTE } from '@/routes/definitions';
import { Response, Request, Router } from 'express';

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
