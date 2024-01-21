import { IUserRepo } from '../interface/user-repo.interface';
import { User } from '../models/user.model';

export class MockUserRepository implements IUserRepo {
    create(user: User): Promise<User> {
        const mockUser = {
            ...user,
        };
        return Promise.resolve(mockUser);
    }
    findOne(id: string): Promise<User> {
        throw new Error('Method not implemented.');
    }
    findAll(): Promise<User[]> {
        throw new Error('Method not implemented.');
    }
    update(data: User): Promise<User> {
        throw new Error('Method not implemented.');
    }
    delete(id: string): Promise<User> {
        throw new Error('Method not implemented.');
    }
}
