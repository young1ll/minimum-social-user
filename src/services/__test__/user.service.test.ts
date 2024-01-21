import { IUserRepo } from '../../interface/user-repo.interface';
import { User } from '../../models/user.model';
import { MockUserRepository } from '../../repository/mock-user.repo';
import { userFactory } from '../../utils/fixtures';
import { UserService } from '../user.service';
import { faker } from '@faker-js/faker';

const mockUser = (data: any) => {
    const { id, username, email } = data;
    return {
        id: id || faker.string.uuid(),
        username: username || faker.internet.userName(),
        email: email || faker.internet.email(),
        ...data,
    };
};

describe('UserService', () => {
    let repository: IUserRepo;

    beforeEach(() => {
        repository = new MockUserRepository();
    });
    afterEach(() => {
        repository = {} as MockUserRepository;
    });

    describe('createUser', () => {
        test('should create a user', async () => {
            const service = new UserService(repository);
            const reqBody = mockUser({});
            const result = await service.createUser(reqBody);

            expect(result).toMatchObject({
                id: expect.any(String),
                username: expect.any(String),
                email: expect.any(String),
            });
        });

        test('should throw an error with a user creation failed', async () => {
            const service = new UserService(repository);
            const reqBody = mockUser({ id: '' });

            jest.spyOn(repository, 'create').mockImplementationOnce(() =>
                Promise.resolve({} as User)
            );

            expect(service.createUser(reqBody)).rejects.toThrow('User creation failed');
        });

        test('should throw an error with a user already exists', async () => {
            const service = new UserService(repository);
            const reqBody = mockUser({});

            jest.spyOn(repository, 'create').mockImplementationOnce(() =>
                Promise.reject(new Error('User already exists'))
            );

            expect(service.createUser(reqBody)).rejects.toThrow('User already exists');
        });
    });

    describe('updateUser', () => {
        test('should update a user', async () => {
            const service = new UserService(repository);
            const reqBody = mockUser({});
        });
    });
});
