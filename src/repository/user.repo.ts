import { Sequelize } from 'sequelize';
import { IUserRepo } from '@/interface/user-repo.interface';
import { User, UserAttributes, UserOutput } from '@/models/user.model';

export class UserRepository implements IUserRepo {
    async create(input: UserAttributes): Promise<UserOutput> {
        // return Promise.resolve(input as UserOutput);
        const data = await User.create({ ...input });
        return Promise.resolve(data.get());
    }

    async findOneByEmail(email: string): Promise<UserOutput | null> {
        const data = await User.findOne({ where: { email } });
        return data?.toJSON() || null;
    }

    async findOneById(id: string): Promise<UserOutput | null> {
        const data = await User.findOne({ where: { id } });
        // console.log(data);
        return Promise.resolve(data?.get());
        // throw new Error('Method not implemented.');
    }
    async findOneByUsername(username: string): Promise<UserOutput | null> {
        const data = await User.findOne({ where: { username } });
        return Promise.resolve(data?.get());
        // throw new Error('Method not implemented.');
    }

    // WARNING! : 모든 사용자 조회
    async findAll(): Promise<UserOutput[] | null> {
        const data = await User.findAll();
        return Promise.resolve(data.map((user) => user.get()));
        // throw new Error('Method not implemented.');
    }

    async count(): Promise<number> {
        const data = await User.count();
        return Promise.resolve(data);
    }

    // WARNING! : 모든 사용자 검색 (**Full-Text Search**)
    async searchUserByUsername(
        q: string
    ): Promise<Pick<UserOutput, 'id' | 'email' | 'username' | 'profileImage'>[] | null> {
        const data = await User.findAll({
            where: Sequelize.literal(`(
                username COLLATE utf8mb4_general_ci LIKE :searchQuery
                OR
                email COLLATE utf8mb4_general_ci LIKE :searchQuery
              )`),
            replacements: {
                searchQuery: `%${q}%`,
            },
        });
        return Promise.resolve(data.map((user) => user.get()));
    }

    async update({
        id,
        body,
    }: {
        id: string;
        body: Omit<UserAttributes, 'id' | 'email' | 'createdAt' | 'updatedAt'>;
    }): Promise<number> {
        const data = await User.update({ ...body }, { where: { id } });
        return Promise.resolve(data[0]);
        // throw new Error('Method not implemented.');
    }
    async delete(id: string): Promise<number> {
        const data = await User.destroy({ where: { id } });
        return Promise.resolve(data);
        // throw new Error('Method not implemented.');
    }
}
