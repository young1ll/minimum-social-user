import { IUser, OTP, UserDocument } from '@/models';
import { Model } from 'mongoose';

export default class MongoDBUserRepository {
  private UserModel: Model<UserDocument>; // mongoose 모델 저장을 위한 private 변수

  constructor(UserModel: Model<UserDocument>) {
    this.UserModel = UserModel;
  }

  async createUser(userData: IUser): Promise<UserDocument> {
    try {
      const user = new this.UserModel(userData);
      const savedUser = await user.save();
      return savedUser;
    } catch (error) {
      console.error(`유저 생성 중 오류 발생: ${error}`);
      throw new Error(`유저 생성 중 오류 발생: ${error}`);
    }
  }

  // WARN: 관리자 용
  async getAllUsers(): Promise<UserDocument[]> {
    try {
      const users = await this.UserModel.find();
      return users;
    } catch (error) {
      console.error(`유저 조회 중 오류 발생: ${error}`);
      throw new Error(`유저 조회 중 오류 발생: ${error}`);
    }
  }

  /**
   * Full-Text Search
   * - query: email | username
   * @param query
   * @returns
   */
  async searchUsers(query: string): Promise<UserDocument[]> {
    try {
      // console.log(query); // 검색어 검사
      const users = await this.UserModel.find({
        $or: [
          { username: { $regex: query, $options: 'i' } }, // 대소문자 구분 없음
          { email: { $regex: query, $options: 'i' } },
        ],
      });
      return users;
    } catch (error) {
      console.error(`유저 검색 중 오류 발생: ${error}`);
      throw new Error(`유저 검색 중 오류 발생: ${error}`);
    }
  }

  async getUserByEmail(email: string): Promise<UserDocument | null> {
    try {
      const user = await this.UserModel.findOne({ email });
      // console.log(user); // 유저 반환 검사
      return user || null;
    } catch (error) {
      console.log(`Email: ${email}로 유저 조회 중 오류 발생: ${error}`);
      throw new Error(`Email: ${email}로 유저 조회 중 오류 발생: ${error}`);
    }
  }

  async getUserByUsername(username: string): Promise<UserDocument | null> {
    try {
      const user = await this.UserModel.findOne({ username });
      return user;
    } catch (error) {
      console.error(`Username으로 유저 조회 중 오류 발생: ${error}`);
      throw new Error(`Username으로 유저 조회 중 오류 발생: ${error}`);
    }
  }

  /**
   * ID로 사용자 인증
   *
   * @param {string} id - The ID of the user.
   * @return {Promise<UserDocument | null>} The updated user document, or null if the user was not found.
   */
  async updateVerified(id: string): Promise<UserDocument | null> {
    try {
      const user = await this.UserModel.findByIdAndUpdate(
        id,
        {
          verified: true,
        },
        { new: true }, // 업데이트 이후 내용 반환
      );
      return user;
    } catch (error) {
      console.error(`유저 인증 중 오류 발생: ${error}`);
      throw new Error(`유저 인증 중 오류 발생: ${error}`);
    }
  }

  /**
   * // TODO: verifed, password 등 특정 정보 수정 불가
   * @param userEmail
   * @param newData
   * @returns
   */
  async updateUser(
    userEmail: string,
    newData: Partial<IUser>,
  ): Promise<UserDocument | null> {
    try {
      const user = await this.UserModel.findOneAndUpdate(
        { email: userEmail },
        newData,
        {
          new: true, // 업데이트 이후 내용 반환
        },
      );
      return user;
    } catch (error) {
      console.error(`유저 업데이트 중 오류 발생: ${error}`);
      throw new Error(`유저 업데이트 중 오류 발생: ${error}`);
    }
  }

  async deleteUser(userId: string): Promise<void> {
    try {
      await this.UserModel.findOneAndDelete({ _id: userId });
      await OTP.deleteMany({ userId }); // CASECADE DELETE
    } catch (error) {
      console.error(`유저 삭제 중 오류 발생: ${error}`);
      throw new Error(`유저 삭제 중 오류 발생: ${error}`);
    }
  }
}
