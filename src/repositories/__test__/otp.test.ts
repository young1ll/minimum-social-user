import { OTP } from '@/models';
import { OTPRepository } from '@/repositories';

describe('OTPRepository/', () => {
  const otpRepository = new OTPRepository(OTP);

  it('createOTP/ should create and save a new OTP entry', async () => {
    const email = 'test@example';
    const otp = '123456';
    const result = await otpRepository.createOTP({ email, otp });
    expect(result.email).toBe(email);
    expect(result.otp).toBe(otp);
  });

  it('findRecentOtpByEmail/ should return null if no OTP found for the given email', async () => {
    const result = await otpRepository.findRecentOtpByEmail(
      'nonexistent@example.com',
    );
    expect(result).toBeNull();
  });

  it('findRecentOtpByEmail/ should return the most recent OTP for the given email', async () => {
    const email = 'test@example';
    const otp = '123456';
    await otpRepository.createOTP({ email, otp });
    const result = await otpRepository.findRecentOtpByEmail(email);
    expect(result?.email).toBe(email);
    expect(result?.otp).toBe(otp);
  });
});
