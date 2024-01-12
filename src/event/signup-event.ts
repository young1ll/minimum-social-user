import { OTPService } from '@/services';
import { BaseAuthEvent } from './base-event';
import { OtpDocument, UserDocument } from '../models';

export type SignUpRestPayload = {
  id: string;
  email: string;
  otp: string;
};

export default class EventSignedUp extends BaseAuthEvent<SignUpRestPayload> {
  private user: UserDocument;

  private statusCode = 201;

  constructor(user: UserDocument) {
    super();
    this.user = user;
  }

  async getOtp(): Promise<string> {
    try {
      const otp = await new OTPService().getRecentOtpById(this.user._id);
      if (!otp) {
        return '';
      }
      return otp.otp;
    } catch (error) {
      return '';
    }
  }

  getStatusCode(): number {
    return this.statusCode;
  }

  async serializeRest(): Promise<SignUpRestPayload> {
    const otp = await this.getOtp();
    return {
      id: this.user._id,
      email: this.user.email,
      otp,
    };
  }
}
