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
  async generateOTP({ userId }: { userId: string }) {
    try {
      const otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });

      const otpPayload: otpPayloadType = { userId, otp };

      const response = await this.OTPRepository.createOTP(otpPayload);

      return response;
    } catch (error) {
      throw new Error(`error occurred while generating OTP ${error}`);
    }
  }

  async getRecentOtpById(userId: string) {
    const otp = await this.OTPRepository.findRecentOtpById(userId);
    return otp;
  }

  async verifyOtpById({ userId, otp }: otpPayloadType) {
    try {
      const recentOtp = await this.OTPRepository.findRecentOtpById(userId);

      if (recentOtp && recentOtp.otp === otp) {
        return { otp, verified: true }; // 유효한 OTP인 경우
      }

      return { verifed: false }; // 유효하지 않은 OTP인 경우
    } catch (error) {
      throw new Error('error occurred while verifying OTP');
    }
  }
}
