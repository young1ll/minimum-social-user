import { OtpController } from '@/controllers';
import { withIsVerifiedByEmailBody } from '@/middleware/verified-request';
import { OTP_ROUTE, VERIFY_ROUTE } from '@/routes/definitions';
import { Router } from 'express';

const OtpRouter = Router();

OtpRouter.get(
  `${VERIFY_ROUTE}/:encodedEmail/:encodedToken/:handler`,
  OtpController.verifyByParams,
); // url로 인증: handler: otp

// REGENERATE OTP
OtpRouter.post(`${OTP_ROUTE}/regenerate`, OtpController.regenerateOtp);
OtpRouter.post(OTP_ROUTE, OtpController.verifyByEmailAndOtp); // 인증

export default OtpRouter;
