import { Request, Response, NextFunction } from 'express';

const errorHandler = (
  err: Error, // throw를 만나서 도달
  _req: Request,
  res: Response,
  _next: NextFunction,
): Response => {
  // if (err instanceof BaseCustomError) {

  // }

  return res.sendStatus(500); // 항상 500을 반환
};

export default errorHandler;
