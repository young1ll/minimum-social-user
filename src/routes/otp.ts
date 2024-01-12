import { OtpController } from '@/controllers';
import { Router } from 'express';

export const OTP_ROUTE = '/api/auth/otp';
const OtpRouter = Router();

OtpRouter.post(OTP_ROUTE, OtpController);

export default OtpRouter;
