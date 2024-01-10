import { IUser, UserDocument } from '@/models';
import { Model } from 'mongoose';

// UserRepository 클래스가 구현해야 하는 인터페이스 정의
interface UserRepositoryInterface {
  createUser(userData: IUser): Promise<UserDocument>; // 유저 생성
  getAllUsers(): Promise<UserDocument[]>; // 모든 유저 조회
  getUserByEmail(email: string): Promise<UserDocument | null>; // 유저 아이디로 조회
  updateUser(
    userId: string,
    newData: Partial<IUser>,
  ): Promise<UserDocument | null>; // 유저 정보 업데이트
  deleteUser(userId: string): Promise<void>; // 유저 삭제
}

export default class MongoDBUserRepository implements UserRepositoryInterface {
  private UserModel: Model<UserDocument>; // mongoose 모델 저장을 위한 private 변수

  constructor(UserModel: Model<UserDocument>) {
    this.UserModel = UserModel; // 주어진 mongoose 모델을 저장하여 활용
  }

  async createUser(userData: IUser): Promise<UserDocument> {
    try {
      const user = new this.UserModel(userData);
      const savedUser = await user.save();
      return savedUser;
    } catch (error) {
      throw new Error(`유저 생성 중 오류 발생: ${error}`);
    }
  }

  async getAllUsers(): Promise<UserDocument[]> {
    try {
      const users = await this.UserModel.find();
      return users;
    } catch (error) {
      throw new Error(`유저 조회 중 오류 발생: ${error}`);
    }
  }

  async getUserByEmail(email: string): Promise<UserDocument | null> {
    try {
      const user = await this.UserModel.findOne({ email });
      return user;
    } catch (error) {
      throw new Error(`유저 조회 중 오류 발생: ${error}`);
    }
  }

  async updateUser(
    userId: string,
    newData: Partial<IUser>,
  ): Promise<UserDocument | null> {
    try {
      const user = await this.UserModel.findByIdAndUpdate(userId, newData, {
        new: true,
      });
      return user;
    } catch (error) {
      throw new Error(`유저 업데이트 중 오류 발생: ${error}`);
    }
  }

  async deleteUser(userId: string): Promise<void> {
    try {
      await this.UserModel.findByIdAndDelete(userId);
    } catch (error) {
      throw new Error(`유저 삭제 중 오류 발생: ${error}`);
    }
  }
}
