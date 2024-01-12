import { SignUpController } from '@/controllers';
import { ValidateReturn, usernameValidation } from '@/middleware';
import {
  emailValidation,
  passwordValidation,
} from '@/middleware/validate-request';
import { Router } from 'express';

export const SIGNUP_ROUTE = '/api/auth/signup';
const SignUpRouter = Router();

SignUpRouter.post(
  SIGNUP_ROUTE,
  [usernameValidation, emailValidation, passwordValidation],
  ValidateReturn,
  SignUpController,
);

export default SignUpRouter;
