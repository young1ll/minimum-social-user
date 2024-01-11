import config from '@/config';
import InvalidInputError from '@/errors/invalid-error';
import { UserSignedUpEv } from '@/event';
import { UserService } from '@/services';
import MailgunService from '@/services/mailgun-service';
import OTPService from '@/services/otp-service';
import { Request, Response } from 'express';
import { validationResult } from 'express-validator';

// 서비스 등록
const otpService = new OTPService();
const userService = new UserService();
const mailgunService = new MailgunService({
  apiKey: config.mailgun.apiKey!,
});

const sendEmailWithOtp = async (email: string) => {
  // OTP 생성
  const otpResponse = await otpService.generateOTP(email);
  if (!otpResponse) {
    throw new Error('Error generating OTP.');
  }

  const welcomeMail = {
    domain: config.mailgun.domain!,
    fromEmail: config.mailgun.adminEmail!,
    toEmail: email,
    subject: '[minimum-socials] 회원 가입 인증 메일',
    message: `Your verification code is: ${otpResponse.otp}`,
  };
  // 이메일 전송
  await mailgunService.sendMailFromAdmin(welcomeMail);
};

export const SignUpController = async (req: Request, res: Response) => {
  const errors = validationResult(req).array();

  if (errors.length > 0) {
    throw new InvalidInputError(errors);
  }

  try {
    const { email, password, username } = req.body;

    const existingUser = await userService.getUserByEmail({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ error: 'User with this email already exists.' });
    }

    const newUser = await userService.createUser({
      email,
      password,
      username,
    });
    if (!newUser) {
      return res.status(500).json({ error: 'Error creating user.' });
    }

    // OTP 생성
    await sendEmailWithOtp(email);

    // Event: 회원 생성 성공
    const signupEvent = new UserSignedUpEv(newUser!);
    return res
      .status(signupEvent.getStatusCode())
      .send(signupEvent.serializeRest());
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};
