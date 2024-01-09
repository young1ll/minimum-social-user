import { User } from '@/models';
import e, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';

const signUpRouter = e.Router();
export const SIGNUP_ROUTE = '/api/auth/signup';

signUpRouter.post(
  SIGNUP_ROUTE,
  [
    body('email')
      .trim()
      .isEmail()
      .withMessage('Please provide a valid email address')
      .normalizeEmail(),
    body('password')
      .trim()
      .isLength({ min: 6, max: 32 })
      .withMessage('Password must be between 6 and 32 characters')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,32}$/)
      .withMessage(
        'Password must contain at least one lowercase letter, one uppercase letter, and one number',
      )
      .escape(),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.sendStatus(422);
    }

    if (/.*@[A-Z]/g.test(req.body.email)) {
      return res.sendStatus(422);
    }

    if (/[><'"/]/g.test(req.body.password)) {
      return res.sendStatus(422);
    }

    const { email, password } = req.body;

    // case1: DB에서 사용자 조회
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.sendStatus(422);
    }

    // case2: DB에 사용자 저장
    const newUser = new User({
      email,
      password,
    }).save();

    return res.send({ email: req.body.email });
  },
);

export default signUpRouter;
