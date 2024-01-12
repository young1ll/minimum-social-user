import { OtpDocument } from '@/models';
import mongoose, { Model } from 'mongoose';

export type otpPayloadType = {
  userId: string;
  otp: string;
};

export default class OTPRepository {
  private OtpModel: Model<OtpDocument>;

  constructor(OtpModel: Model<OtpDocument>) {
    this.OtpModel = OtpModel;
  }

  // 중복 검사를 위한 findOtp 제거

  /**
   * userId로 최근 생성된 OTP 가져오기
   * - 만료되지 않은 최근 otp 가져오기
   * - 생성 후에는 반드시 findRecentOtpById()로 가져와야 한다.
   * - userId로 해당하는 otp 검증
   */
  async findRecentOtpById(userId: string): Promise<OtpDocument> {
    const parsedId = new mongoose.Types.ObjectId(userId);
    try {
      const currentTime = new Date();
      const recentOtp = await this.OtpModel.findOne({
        userId: parsedId, // userId,
        // createdAt: { $gte: currentTime }, // 현재시간 기준 만료되지 않은 otp
      })
        .sort({ createdAt: -1 })
        .limit(1);
      if (!recentOtp) throw new Error('no recent otp');

      return recentOtp;
    } catch (error) {
      if (error instanceof Error && error.name === 'MongoError') {
        throw new Error(`MongoDB에서 오류가 발생했습니다: ${error.message}`);
      }
      throw new Error(`최근 OTP 조회 중 오류 발생: ${error}`);
    }
  }

  /**
   * userId로 OTP 생성
   * @param param0
   * @returns savedOTP
   */
  async createOTP({ userId, otp }: otpPayloadType): Promise<OtpDocument> {
    try {
      // 만료시간 조정 필요한 경우, entry 에 직접 설정
      // 만료시간 추가
      const expiresAt = new Date();
      expiresAt.setMinutes(expiresAt.getMinutes() + 10);

      const otpEntry = new this.OtpModel({
        userId,
        otp,
        expiresAt,
      });

      // console.log(otpEntry);
      const savedOTP = await otpEntry.save();
      return savedOTP;
    } catch (error) {
      throw new Error(`OTP 생성 중 오류 발생: ${error}`);
    }
  }
}
