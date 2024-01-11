import mailSender from '@/utils/mail-sender';
import mongoose, { Document, Model } from 'mongoose';

export interface IOtp {
  phone?: string;
  email?: string;
  otp: string;
  // secret?: string;
}

export interface OtpDocument extends IOtp, Document {}
export interface OtpModel extends Model<OtpDocument> {}

const otpSchema = new mongoose.Schema({
  // phone: {
  //   type: String,
  //   required: true,
  // },
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  // secret: {
  //   type: String,
  //   required: true,
  // },
  // createdAt 자동 생성되지만, 만료 시간을 설정
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 60 * 5, // 5분
  },
});

// TODO: mail-service 참고/ Mailgun으로 사용
// async function sendVerificationEmail(email: string, otp: string) {

//   try {
//     const mailResponse = await mailSender({
//       email,
//       title: 'Verification Email',
//       body: `<h1>Please confirm your OTP</h1>
//       <p>Here is your OTP code: ${otp}</p>`,
//     });
//     console.log('Email sent successfully: ', mailResponse);
//   } catch (error) {
//     console.log('Error occurred while sending email: ', error);
//     throw error;
//   }
// }

// otpSchema.pre('save', async function preOtpSave(next) {
//   console.log('New document saved to the database');
//   // Only send an email when a new document is created
//   if (this.isNew) {
//     await sendVerificationEmail(this.email, this.otp);
//   }
//   next();
// });

const OTP = mongoose.model<OtpDocument, OtpModel>('OTP', otpSchema);
export default OTP;
