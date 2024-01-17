import config from '@/config';
import aws from 'aws-sdk';

import { UserService } from '@/services';
import NodeMailerService from '@/services/nodemailer-service';
import { Request, Response } from 'express';
import { validationResult } from 'express-validator';

// 서비스 등록

const nodemailerService = new NodeMailerService();

/**
 * - 현재 사용하지 않음
 * - 무료 제한
 * nodemailer로 대체
 */
// const sendMailgunWithOtp = async ({
//   userId,
//   email,
// }: {
//   userId: string;
//   email: string;
// }) => {
//   // OTP 생성
//   const otpResponse = await otpService.generateOTP({ userId });
//   if (!otpResponse) {
//     throw new Error('Error generating OTP.');
//   }

//   const welcomeMail = {
//     domain: config.mailer.mg_domain!,
//     fromEmail: config.mailer.adminEmail!,
//     toEmail: email,
//     subject: '[minimum-socials] 회원 가입 인증 메일',
//     message: `
//     <h1>Welcome!</h1>
//     <h2>OTP를 확인해주세요</h2>
//     <p>Your verification code is: ${otpResponse.otp}</p>
//     <p>제한 시간: 5분</p>
//     `,
//   };
//   // 이메일 전송
//   await mailgunService.sendMailFromAdmin(welcomeMail);
// };

const sendNodemailerWithOtp = async ({
  userId,
  email,
}: {
  userId: string;
  email: string;
}) => {
  // OTP 생성 #3 #10
  // const otpResponse = await otpService.generateOTP({ userId });
  // if (!otpResponse) {
  //   throw new Error('Error generating OTP.');
  // }

  // const encodedToken = Buffer.from(otpResponse.otp).toString('base64');
  // const encodedEmail = Buffer.from(email).toString('base64');

  // console.log(otpResponse.expiresAt);

  const welcomeMail = {
    toEmail: email,
    subject: '[minimum-social] 회원 가입 인증 메일',
    html: `
    <h1>Welcome!</h1>
    <h2>OTP를 확인해주세요</h2>`,
    // <p>Your verification code is: ${otpResponse.otp}</p>
    // <p><a href="http://localhost:3000/api/auth/verify/${encodedEmail}/${encodedToken}/otp">Click here</a></p>
    // <p>expires: ${otpResponse.expiresAt.toLocaleString()}</p>
  };
  // 이메일 전송
  await nodemailerService.sendEmail(welcomeMail);
};

/**
 * Handles the sign-up request and creates a new user. #4
 *
 * @param {Request} req - The HTTP request object.
 * @param {Response} res - The HTTP response object.
 * @return {Promise<void>} A promise that resolves when the user is created successfully or rejects with an error.
 */
export const SignUpController = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors });
  }

  try {
    const { email, password, username } = req.body;

    // const existingUser = await userService.getUserByEmail({ email });
    // if (existingUser) {
    //   return res
    //     .status(400)
    //     .json({ error: 'User with this email already exists.' });
    // }

    // const newUser = await userService.createUser({
    //   email,
    //   password,
    //   username,
    // });
    // if (!newUser) {
    //   return res.status(500).json({ error: 'Error creating user.' });
    // }

    // // OTP 생성
    // // await sendMailgunWithOtp(email);
    // await sendNodemailerWithOtp({ email, userId: newUser._id });

    // // Event: 회원 생성 성공
    // return res.status(200).send({
    //   user: newUser,
    //   // otp: signupEvent.getOtp(),
    // });
    return res.status(200).send({});
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};
