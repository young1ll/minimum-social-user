import InvalidInputError from '@/errors/invalid-error';
import { UserSignedUpEv } from '@/event';
import { UserService } from '@/services';
import { ISignupDTO } from '@/services/user-service';
import { Request, Response } from 'express';
import { validationResult } from 'express-validator';

export const SignUpController = async (req: Request, res: Response) => {
  const errors = validationResult(req).array();

  const userService = new UserService();

  if (/.*@[A-Z]/g.test(req.body.email)) {
    errors.push({
      location: 'body',
      type: 'field',
      path: 'email',
      msg: 'Please provide a valid email address',
      value: req.body.email,
    });
  }

  if (/[><'"/]/g.test(req.body.password)) {
    errors.push({
      location: 'body',
      type: 'field',
      path: 'email',
      msg: 'Please provide a valid email address',
      value: req.body.email,
    });
  }

  if (errors.length > 0) {
    throw new InvalidInputError(errors);
  }

  const { email, password }: ISignupDTO = req.body;

  const userSignUp = await userService.signUp(
    req.body.username,
    email,
    password,
  );
  const signupEvent = new UserSignedUpEv(userSignUp);

  return res
    .status(signupEvent.getStatusCode())
    .send(signupEvent.serializeRest());
};
