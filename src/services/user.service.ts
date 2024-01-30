import { IUserRepo } from '@/interface/user-repo.interface';
import { User, UserAttributes, UserInput, UserOutput } from '@/models/user.model';
import { uniqueUsernameGenerator } from 'unique-username-generator';

export class UserService {
    private _repository: IUserRepo;

    constructor(repository: IUserRepo) {
        this._repository = repository;
    }
    async createUser(input: UserInput): Promise<UserOutput> {
        try {
            const { id, email, username, ...rest } = input;
            if (!id || !email || !username) {
                const missingFields = [];

                if (!id) {
                    missingFields.push('id');
                }

                if (!email) {
                    missingFields.push('email');
                }

                if (!username) {
                    missingFields.push('username');
                }

                const errorMessage = `User fields (${missingFields.join(', ')}) are empty.`;
                throw new Error(errorMessage);
            }

            const data = {
                id,
                email,
                username,
                ...rest,
            };

            // console.log(data);
            const result = await this._repository.create(data);
            return result;
        } catch (error) {
            throw error;
        }
    }

    async findOneUserById(id: UserInput['id']): Promise<UserOutput | null> {
        try {
            if (!id) {
                throw new Error('id is empty');
            }

            const data = await this._repository.findOneById(id);
            // console.log(data);
            return data;
        } catch (error) {
            throw error;
        }
    }

    async findOneUserByEmail(email: UserAttributes['email']): Promise<UserOutput | null> {
        try {
            if (!email) {
                throw new Error('email is empty');
            }

            const data = await this._repository.findOneByEmail(email);
            return data;
        } catch (error) {
            throw error;
        }
    }

    async findOneUserByUsername(username: UserAttributes['username']): Promise<UserOutput | null> {
        try {
            if (!username) {
                throw new Error('username is empty');
            }

            const data = await this._repository.findOneByUsername(username);
            return data;
        } catch (error) {
            throw error;
        }
    }

    async findAllUser(): Promise<UserOutput[] | null> {
        try {
            const data = await this._repository.findAll();

            return data;
        } catch (error) {
            throw error;
        }
    }

    async countUser(): Promise<number> {
        try {
            const data = await this._repository.count();
            return data;
        } catch (error) {
            throw error;
        }
    }

    async searchUserByUsername(
        q: string
    ): Promise<Pick<UserOutput, 'id' | 'email' | 'username' | 'profileImage'>[] | null> {
        try {
            const data = await this._repository.searchUserByUsername(q);
            return data;
        } catch (error) {
            throw error;
        }
    }

    async updateUser({
        id,
        body,
    }: {
        id: UserInput['id'];
        body: Omit<UserAttributes, 'id' | 'email'>;
    }): Promise<number> {
        try {
            if (!id) {
                throw new Error('id is empty');
            }

            const data = await this._repository.update({ id, body });
            return data;
        } catch (error) {
            throw error;
        }
    }

    async deleteUser(id: string): Promise<UserOutput> {
        try {
            const data = await this._repository.findOneById(id);
            if (!data) {
                throw new Error('user not found');
            }

            const result = await this._repository.delete(id);
            if (!result) {
                throw new Error('user cannot deleted');
            }

            return data;
        } catch (error) {
            throw error;
        }
    }
}
