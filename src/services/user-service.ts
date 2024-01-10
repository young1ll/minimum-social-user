import { IUser, User, UserDocument } from '@/models';
import { MongoDBUserRepository } from '@/repositories';

export interface ISignupDTO {
  username?: string;
  email: string;
  password: string;
}

export default class UserService {
  private UserRepository: MongoDBUserRepository;

  constructor() {
    this.UserRepository = new MongoDBUserRepository(User);
  }

  async signUp(username: string, email: string, password: string) {
    try {
      const existingUser = await this.UserRepository.getUserByEmail(email);

      if (existingUser) {
        throw new Error('Email already exists');
      }

      const newUser = await this.UserRepository.createUser({
        username,
        email,
        password,
      });
      return newUser;
    } catch (error) {
      throw new Error('Failed to sign up');
    }
  }
}
