// import { CreateUserRequest, UpdateUserRequest } from '../dto/user.dto';
import { User, UserAttributes, UserInput, UserOutput } from '@/models/user.model';

export interface IUserRepo {
    create(user: UserInput): Promise<UserOutput>;
    findOneById(id: string): Promise<UserOutput | null>;
    findOneByEmail(email: string): Promise<UserOutput | null>;
    findOneByUsername(username: string): Promise<UserOutput | null>;
    findAll(): Promise<UserOutput[] | null>;

    count(): Promise<number>;
    searchUserByUsername(
        username: string
    ): Promise<Pick<UserOutput, 'id' | 'email' | 'username' | 'profileImage'>[] | null>;

    update({
        id,
        body,
    }: {
        id: UserInput['id'];
        body: Omit<UserAttributes, 'id' | 'email'>;
    }): Promise<number>;

    delete(id: string): Promise<number>;
}
