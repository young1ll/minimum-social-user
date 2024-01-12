import { SignUpController } from '@/controllers';
import { ValidateReturn, usernameValidation } from '@/middleware';
import {
  emailValidation,
  passwordValidation,
} from '@/middleware/validate-request';
import { SIGNUP_ROUTE } from '@/routes/definitions';
import { Router } from 'express';

const SignUpRouter = Router();

SignUpRouter.post(
  SIGNUP_ROUTE,
  [usernameValidation, emailValidation, passwordValidation],
  ValidateReturn,
  SignUpController,
);

export default SignUpRouter;
