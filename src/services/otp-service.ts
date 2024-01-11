import { OTP, OtpDocument } from '@/models';
import { OTPRepository } from '@/repositories';
import { otpPayloadType } from '@/repositories/otp-repos';
import otpGenerator from 'otp-generator';

export default class OTPService {
  private OTPRepository: OTPRepository;

  constructor() {
    this.OTPRepository = new OTPRepository(OTP);
  }

  /**
   * Email로 OTP(Time-based One Time Password) 생성.
   */
  async generateOTP(email: string) {
    try {
      const otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });

      const otpPayload: otpPayloadType = { email, otp };
      const response = await this.OTPRepository.createOTP(otpPayload);

      return response;
    } catch (error) {
      throw new Error('error occurred while generating OTP');
    }
  }

  async verifyOtpByEmail({ email, otp }: otpPayloadType): Promise<boolean> {
    try {
      const recentOtp = await this.OTPRepository.findRecentOtpByEmail(email!);

      if (recentOtp && recentOtp.otp === otp) {
        return true; // 유효한 OTP인 경우
      }

      return false; // 유효하지 않은 OTP인 경우
    } catch (error) {
      throw new Error('error occurred while verifying OTP');
    }
  }
}
