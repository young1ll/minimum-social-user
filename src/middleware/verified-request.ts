import { UserService } from '@/services';
import { NextFunction, Request, Response } from 'express';

const userService = UserService();

/**
 * parameter로 사용자 otp 인증 여부 검사 #4
 *
 * verified === true
 * pass "currentUser" to req
 */
export const withIsVerifiedByEmailParam = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { userEmail } = req.params;
  const currentUser = await userService.findByEmail({
    sk: userEmail, // TODO: pk => userEmail
  });
  // 사용자 존재 여부
  if (!currentUser) {
    return res.status(404).send({ error: 'User not found.' });
  }
  // 사용자 인증 여부
  // if (currentUser.verified === false) {
  //   return res.status(400).send({ error: 'User is not verified.' });
  // }

  // req.currentUser = currentUser;
  return next();
};

/**
 * body로 사용자 otp 인증 여부 검사 #4
 *
 * verified === true
 * pass "currentUser" to req
 */
export const withIsVerifiedByEmailBody = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { email } = req.body;
  const currentUser = await userService.findByEmail({
    sk: email, // TODO: pk => userEmail
  });
  // 사용자 존재 여부
  if (!currentUser) {
    return res.status(404).send({ error: 'User not found.' });
  }
  // 사용자 인증 여부
  // if (currentUser.verified === false) {
  //   return res.status(400).send({ error: 'User is not verified.' });
  // }
  // req.currentUser = currentUser;
  return next();
};

/**
 * JWT Authentication #4
 * Security
 */
export const withAthenticated = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.headers.authorization) {
    return res.status(401).send({ error: 'User not authorized.' });
  }

  let token = req.headers.authorization;
  // Bearer [token]
  if (token.startsWith('Bearer ')) {
    token = token.slice(7, token.length);
    // logic
  }

  return next();
};
