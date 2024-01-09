import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';

const signUpRouter = express.Router();

signUpRouter.post(
  '/api/auth/signup',
  [body('email').isEmail().withMessage('Email must be valid')],
  (req: Request, res: Response) => {
    const errors = validationResult(req);

    console.log(errors.array());

    if (!errors.isEmpty()) {
      res.status(422).send({});
    }
    res.send({});
  },
);

export default signUpRouter;
