import { OTPService, UserService } from '@/services';
import { Request, Response } from 'express';

const otpService = new OTPService();
const userService = new UserService();

export const OtpController = async (req: Request, res: Response) => {
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

    const verifyOtp = await otpService.verifyOtpById({ userId: _id, otp });
    if (!verifyOtp) {
      return res.status(422).json({ error: 'Failed to verify OTP.' });
    }
    return res.status(201).send({
      currentUser,
      otpResponse,
      message: 'OTP verified successfully.',
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};
