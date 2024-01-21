import { IUserRepo } from '@/interface/user-repo.interface';
import { User, UserAttributes, UserInput, UserOutput } from '@/models/user.model';
import { uniqueUsernameGenerator } from 'unique-username-generator';

const usernameList = [
    'john',
    'jane',
    'bob',
    'alice',
    'charlie',
    'dave',
    'eva',
    'frank',
    'george',
    'harry',
    '영일',
    '민수',
    '철수',
    '영희',
    '민지',
    '철진',
    '영혜',
    '지혜',
    '영준',
];

export class UserService {
    private _repository: IUserRepo;

    constructor(repository: IUserRepo) {
        this._repository = repository;
    }
    async createUser(input: UserInput): Promise<UserOutput> {
        try {
            const { id, email } = input;
            if (!id || !email) {
                throw new Error('user id or email is empty');
            }

            let username: string | undefined = undefined;
            let isUsernameUnique = false;

            while (!isUsernameUnique) {
                // 중복 방지
                username = uniqueUsernameGenerator({
                    dictionaries: [usernameList],
                    separator: '-',
                    randomDigits: 2,
                });

                isUsernameUnique = !(await this._repository.findOneByUsername(username));
            }
            const now = new Date();

            const data = {
                id,
                email,
                username, // first time auto generate
                createdAt: now.toISOString(),
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
