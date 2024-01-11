import OTPService from '@/services/otp-service';

describe('OTPService/', () => {
  const otpService = new OTPService();

  it('generateOTP/ should create and save a new OTP entry', async () => {
    const email = 'test@example';

    const result = await otpService.generateOTP(email);

    // console.log(`generated otp: ${result.otp}`);
    // 결과
    expect(result).toBeTruthy();
    expect(result.email).toBe(email);
    expect(result.otp).toBeTruthy();
  });

  it('generateOTP/ handle errors during the operation', async () => {
    // createOTP 메서드에서 발생하는 에러를 강제로 설정
    jest
      .spyOn(otpService, 'generateOTP')
      .mockRejectedValueOnce(new Error('Test error'));

    // 에러가 발생하는지 확인 //TODO: 추후 statecode 확인
    await expect(otpService.generateOTP('test@example.com')).rejects.toThrow(
      'Test error',
    );
  });
  it('verifyOtpByEmail/ should return true if OTP is valid for the given email', async () => {
    const email = 'test@example';
    const response = await otpService.generateOTP(email);
    const result = await otpService.verifyOtpByEmail({
      email,
      otp: response.otp,
    });
    expect(result).toBeTruthy();
  });

  it('verifyOtpByEmail/ should return false if OTP is invalid for the given email', async () => {
    const email = 'test@example';
    const wrongOtp = '123456';
    await otpService.generateOTP(email);

    const result = await otpService.verifyOtpByEmail({
      email,
      otp: wrongOtp,
    });
    expect(result).toBeFalsy();
  });
});
