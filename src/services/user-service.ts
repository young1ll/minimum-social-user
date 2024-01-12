import DatabaseError from '@/errors/db-error';
import { IUser, User, UserDocument } from '@/models';
import { MongoDBUserRepository } from '@/repositories';

export default class UserService {
  private UserRepository: MongoDBUserRepository;

  constructor() {
    this.UserRepository = new MongoDBUserRepository(User);
  }

  async createUser(userData: Partial<IUser>): Promise<UserDocument | null> {
    const { email, password, username } = userData;
    try {
      const newUser = {
        username: username || email!.split('@')[0],
        email: email!,
        password: password!,
      };

      const existingEmailUser = await this.UserRepository.getUserByEmail(
        newUser.email,
      );
      const existingUsernameUser = await this.UserRepository.getUserByUsername(
        newUser.username,
      );

      if (existingEmailUser) {
        throw new DatabaseError();
      }

      if (existingUsernameUser) {
        throw new DatabaseError();
      }

      const createdUser = await this.UserRepository.createUser(newUser);

      if (!createdUser) {
        throw new DatabaseError();
      }

      return createdUser;
    } catch (error) {
      if (error instanceof Error && error.name === 'MongoError') {
        throw new DatabaseError(error);
      }
      return null;
    }
  }

  async getUserByEmail({
    email,
  }: Pick<IUser, 'email'>): Promise<UserDocument | null> {
    try {
      const user = await this.UserRepository.getUserByEmail(email);
      if (!user) {
        return null;
      }
      return user;
    } catch (error) {
      throw new Error(`회원 검색 중 오류 발생 ${error}`);
    }
  }

  async getUserByUsername({
    username,
  }: Pick<IUser, 'username'>): Promise<UserDocument | null> {
    try {
      const user = await this.UserRepository.getUserByUsername(username);
      if (!user) {
        throw new Error(`User not found: ${username}`);
      }
      return user;
    } catch (error) {
      throw new Error(`회원 검색 중 오류 발생 ${username}`);
    }
  }

  /**
   * 회원 검색
   * - query: email | username
   *
   * @param {string} query - The search query.
   * @return {Promise<UserDocument[] | null>} A promise that resolves to an array of user documents or null.
   */
  async getAllUsersByEmailAndUsername({
    query,
  }: {
    query: string;
  }): Promise<UserDocument[] | null> {
    try {
      const users = await this.UserRepository.searchUsers(query);
      if (!users) {
        throw new Error(`User not found: ${query}`);
      }
      return users;
    } catch (error) {
      throw new Error(`회원 검색 중 오류 발생 ${error}`);
    }
  }

  async getAllUsers() {
    try {
      return await this.UserRepository.getAllUsers();
    } catch (error) {
      throw new Error(`Error getting all users: ${error}`);
    }
  }

  async updateUsername({
    email,
    username,
  }: Pick<UserDocument, 'email' | 'username'>) {
    try {
      const check = await this.UserRepository.getUserByUsername(username);

      if (check) {
        throw new Error(`사용 중인 username: ${username}`);
      }

      return await this.UserRepository.updateUser(email, { username });
    } catch (error) {
      throw new Error(`Error updating user: ${error}`);
    }
  }

  /**
   * Updates the validation status of a user.
   * - 반드시 "id"로 사용자 인증
   *
   * @param {Pick<UserDocument, 'id'>} id - The ID of the user to update.
   * @return {Promise<any>} - A promise that resolves with the updated user.
   */
  async updateUserValidation({ id }: Pick<UserDocument, 'id'>) {
    try {
      return await this.UserRepository.updateVerified(id);
    } catch (error) {
      throw new Error(`유저 인증 중 오류 발생: ${error}`);
    }
  }

  async updateUserData(userData: Partial<IUser>) {
    const { email, ...updatePayload } = userData;

    if (!email) {
      throw new Error('email is required');
    }

    try {
      return await this.UserRepository.updateUser(email, updatePayload);
    } catch (error) {
      throw new Error(`Error updating user: ${error}`);
    }
  }

  /**
   * Deletes a user from the database.
   * - 반드시 "id"로 삭제
   *
   * @param {Pick<UserDocument, 'id'>} id - The ID of the user to delete.
   * @returns {Promise<void>} - A promise that resolves when the user is successfully deleted.
   * @throws {Error} - If there is an error deleting the user.
   */
  async deleteUser({ id }: Pick<UserDocument, 'id'>) {
    try {
      return await this.UserRepository.deleteUser(id);
    } catch (error) {
      throw new Error(`Error deleting user: ${error}`);
    }
  }
}
