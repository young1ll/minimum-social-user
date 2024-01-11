import { IOtp, OtpDocument } from '@/models';
import { Model } from 'mongoose';

export type otpPayloadType = IOtp;

export default class OTPRepository {
  private OtpModel: Model<OtpDocument>;

  constructor(OtpModel: Model<OtpDocument>) {
    this.OtpModel = OtpModel;
  }

  // 중복 검사를 위한 findOtp 제거

  /**
   * 이메일로 최근 생성된 OTP 가져오기
   * - 생성 후에는 반드시 findRecentOtpByEmail()로 가져와야 한다.
   * - 이메일로 해당하는 otp 검증
   */
  async findRecentOtpByEmail(email: string): Promise<OtpDocument | null> {
    try {
      const recentOtp = await this.OtpModel.findOne({ email })
        .sort({ createdAt: -1 })
        .limit(1);
      return recentOtp || null;
    } catch (error) {
      if (error instanceof Error && error.name === 'MongoError') {
        throw new Error(`MongoDB에서 오류가 발생했습니다: ${error.message}`);
      }
      throw new Error(`최근 OTP 조회 중 오류 발생: ${error}`);
    }
  }

  async createOTP({ email, otp }: otpPayloadType): Promise<OtpDocument> {
    try {
      const otpEntry = new this.OtpModel({ email, otp });
      const savedOTP = await otpEntry.save();
      return savedOTP;
    } catch (error) {
      throw new Error(`OTP 생성 중 오류 발생: ${error}`);
    }
  }
}
