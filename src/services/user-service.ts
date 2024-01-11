import { IUser, OTP, User, UserDocument } from '@/models';
import { MongoDBUserRepository, OTPRepository } from '@/repositories';
import otpGenerator from 'otp-generator';

export interface ISignupDTO {
  username?: string;
  email: string;
  password: string;
  otp?: string;
}

export default class UserService {
  private UserRepository: MongoDBUserRepository;

  private OTPRepository: OTPRepository;

  constructor() {
    this.UserRepository = new MongoDBUserRepository(User);
    this.OTPRepository = new OTPRepository(OTP);
  }

  async signUp({ username, email, password, otp }: ISignupDTO) {
    try {
      await this.checkExistingUser(email);

      const newUser = await this.UserRepository.createUser({
        username: username || email.split('@')[0],
        email,
        password,
      });
      return newUser;
    } catch (error) {
      throw new Error('Failed to sign up');
    }
  }

  private async checkExistingUser(email: string) {
    const existingUser = await this.UserRepository.getUserByEmail(email);

    if (existingUser) {
      throw new Error('Email already exists');
    }
  }

  async generateOTP(email: string) {
    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    try {
      const otpPayload = { email, otp };
      const otpBody = await this.OTPRepository.createOTP(otpPayload);

      return otpBody;
    } catch (error) {
      throw new Error('error occurred while generating OTP');
    }
  }
}
