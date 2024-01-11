import config from '@/config';
import InvalidInputError from '@/errors/invalid-error';
import { UserSignedUpEv } from '@/event';
import { UserService } from '@/services';
import MailgunService from '@/services/mailgun-service';
import { ISignupDTO } from '@/services/user-service';
import { Request, Response } from 'express';
import { validationResult } from 'express-validator';

// NOTE: trycatch 안써도 괜찮은가?
export const SignUpController = async (req: Request, res: Response) => {
  const errors = validationResult(req).array();

  const userService = new UserService();
  const mailgunService = new MailgunService(config.mailgun.apiKey!);

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

  const { username, email, password, otp }: ISignupDTO = req.body;

  const userSignUp = await userService.signUp({
    username,
    email,
    password,
    otp,
  });

  const response = await mailgunService.sendMailFromAdmin({
    domain: config.mailgun.domain!,
    toEmail: email,
    subject: 'Welcome to Minimum Socials',
    message: `Welcome ${username}!`,
  });

  const signupEvent = new UserSignedUpEv(userSignUp);

  return res
    .status(signupEvent.getStatusCode())
    .send(signupEvent.serializeRest());
};
