import { Router } from 'express';
import SignUpRouter from './signup';
import SignInRouter from './signin';
import UserRouter from './users';
import OtpRouter from './otp';

const router = Router();

router.use(SignUpRouter);
router.use(SignInRouter);

router.use(UserRouter);
router.use(OtpRouter);

export default router;
