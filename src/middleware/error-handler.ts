import { BaseCustomError } from '@/errors';
import { Request, Response, NextFunction } from 'express';

const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): Response => {
  if (err instanceof BaseCustomError) {
    return res
      .status(err.getStatusCode())
      .send({ errors: err.serializeErrors() });
  }

  return res.sendStatus(500);
};

export default errorHandler;
