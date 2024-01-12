import config from '@/config';
import InvalidInputError from '@/errors/invalid-error';
import { UserSignedUpEv } from '@/event';
import { UserService } from '@/services';
import MailgunService from '@/services/mailgun-service';
import NodeMailerService from '@/services/nodemailer-service';
import OTPService from '@/services/otp-service';
import { Request, Response } from 'express';
import { validationResult } from 'express-validator';

// 서비스 등록
const otpService = new OTPService();
const userService = new UserService();
const mailgunService = new MailgunService({
  apiKey: config.mailer.mg_apiKey!,
});
const nodemailerService = new NodeMailerService();

const sendMailgunWithOtp = async ({
  userId,
  email,
}: {
  userId: string;
  email: string;
}) => {
  // OTP 생성
  const otpResponse = await otpService.generateOTP({ userId });
  if (!otpResponse) {
    throw new Error('Error generating OTP.');
  }

  const welcomeMail = {
    domain: config.mailer.mg_domain!,
    fromEmail: config.mailer.adminEmail!,
    toEmail: email,
    subject: '[minimum-socials] 회원 가입 인증 메일',
    message: `
    <h1>Welcome!</h1>
    <h2>OTP를 확인해주세요</h2>
    <p>Your verification code is: ${otpResponse.otp}</p>
    <p>제한 시간: 5분</p>
    `,
  };
  // 이메일 전송
  await mailgunService.sendMailFromAdmin(welcomeMail);
};

const sendNodemailerWithOtp = async ({
  userId,
  email,
}: {
  userId: string;
  email: string;
}) => {
  // OTP 생성
  const otpResponse = await otpService.generateOTP({ userId });
  if (!otpResponse) {
    throw new Error('Error generating OTP.');
  }

  const welcomeMail = {
    toEmail: email,
    subject: '[minimum-socials] 회원 가입 인증 메일',
    html: `
    <h1>Welcome!</h1>
    <h2>OTP를 확인해주세요</h2>
    <p>Your verification code is: ${otpResponse.otp}</p>
    <p>제한 시간: 5분</p>
    `,
  };
  // 이메일 전송
  await nodemailerService.sendEmail(welcomeMail);
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
    // await sendMailgunWithOtp(email);
    await sendNodemailerWithOtp({ email, userId: newUser._id });

    // Event: 회원 생성 성공
    const signupEvent = new UserSignedUpEv(newUser!);
    // return res
    //   .status(signupEvent.getStatusCode())
    //   .send(signupEvent.serializeRest());
    return res.status(200).send({
      _id: newUser._id,
      email: newUser.email,
      username: newUser.username,
      otp: signupEvent.getOtp(),
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};
