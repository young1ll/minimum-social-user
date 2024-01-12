import mongoose, { Document, Model, Schema, Types } from 'mongoose';

export interface IOtp {
  // phone?: string;
  userId?: Types.ObjectId;
  otp: string;
  // secret?: string;
  expiresAt: Date;
}

export interface OtpDocument extends IOtp, Document {}
export interface OtpModel extends Model<OtpDocument> {}

const otpSchema = new mongoose.Schema(
  {
    // phone: {
    //   type: String,
    //   required: true,
    // },
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User', // User Model 참조
      // unique: true,
    },
    otp: {
      type: String,
      required: true,
    },
    // secret: {
    //   type: String,
    //   required: true,
    // },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true },
);

const OTP = mongoose.model<OtpDocument, OtpModel>('OTP', otpSchema);
export default OTP;
