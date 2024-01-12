import { OTPService, UserService } from '@/services';
import { Request, Response } from 'express';

const otpService = new OTPService();
const userService = new UserService();

export const regenerateOtp = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const currentUser = await userService.getUserByEmail({
      email,
    });
    // 사용자 존재 여부
    if (!currentUser) {
      return res.status(404).send({ error: 'User not found.' });
    }

    const regenOtpResponse = await otpService.generateOTP({
      userId: currentUser._id,
    });
    return res.status(200).json({
      message: `OTP regenerated. successfully`,
      otpResponse: regenOtpResponse,
    });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error.' });
  }
};

export const verifyByEmailAndOtp = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ error: 'Invalid request.' });
    }

    const currentUser = await userService.getUserByEmail({ email });
    if (!currentUser) {
      return res.status(404).json({ error: 'User not found.' });
    }
    const { _id } = currentUser;

    const otpResponse = await otpService.getRecentOtpById(_id);
    if (!otpResponse) {
      return res
        .status(401)
        .json({ error: 'Not found generated OTP from this user.' });
    }
    if (otpResponse.expiresAt < new Date()) {
      return res.status(422).json({ error: 'OTP expired.' });
    }

    const verifyOtp = await otpService.verifyOtpById({ userId: _id, otp });
    if (!verifyOtp || verifyOtp.verifed === false) {
      return res.status(422).json({ error: 'Failed to verify OTP.' });
    }

    const verifiedUser = await userService.updateUserValidation({ id: _id });
    // console.log('verifyByEmailAndOtp', verifyOtp);

    return res.status(201).send({
      verifiedUser,
      otpResponse,
      message: 'OTP verified successfully.',
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};

export const verifyByParams = async (req: Request, res: Response) => {
  try {
    const { encodedEmail, encodedToken, handler } = req.params;
    if (!handler || handler !== 'otp') {
      return res.status(422).send({ error: 'Invalid request.' });
    }

    const decodedToken = Buffer.from(encodedToken as string, 'base64').toString(
      'utf8',
    );

    const decodedEmail = Buffer.from(encodedEmail as string, 'base64').toString(
      'utf8',
    );

    if (!decodedToken || !decodedEmail) {
      return res.status(400).send({ error: 'Invalid request.' });
    }

    const currentUser = await userService.getUserByEmail({
      email: decodedEmail,
    });
    const otpResponse = await otpService.getRecentOtpById(currentUser?._id);
    if (otpResponse.expiresAt < new Date()) {
      return res.status(422).json({ error: 'OTP expired.' });
    }

    if (!currentUser) {
      return res.status(404).send({ error: 'User not found.' });
    }
    const { _id } = currentUser!;

    const verified = await otpService.verifyOtpById(_id);
    return res.status(201).send({ verified });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: 'Internal server error.' });
  }
};
