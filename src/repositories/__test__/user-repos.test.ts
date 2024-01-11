import { User } from '@/models';
import { MongoDBUserRepository } from '@/repositories';

describe('UserRepository/', () => {
  const userRepository = new MongoDBUserRepository(User);
  const userData = {
    username: 'testUsername',
    email: 'testEmail',
    password: 'testPassword', // will be hashed
  };

  //   it('createUser/ should return an error when user model is not valid', async () => {});
  //   it('createUser/ should return an error when user already exists', async () => {});
  it('createUser/ should create and save a new user', async () => {
    const user = await userRepository.createUser(userData);
    // console.log(user);

    expect(user.username).toBe(userData.username);
    expect(user.email).toBe(userData.email);
    expect(user.password).not.toBe(userData.password);
  });

  it('getAllUsers/ should return all users', async () => {
    const user = await userRepository.createUser(userData);
    const users = await userRepository.getAllUsers();
    // console.log(users);
    expect(users.length).toBeGreaterThan(0);
  });

  it('getUserByEmail/ should return a user by email', async () => {
    const user = await userRepository.createUser(userData);
    const foundUser = await userRepository.getUserByEmail(userData.email);
    console.log(foundUser);
    expect(foundUser?.email).toBe(userData.email);
  });

  it('updateUser/ should update a user', async () => {
    const user = await userRepository.createUser(userData);
    const userEmail = user.email;
    const updatedUser = await userRepository.updateUser(userEmail, {
      username: 'updatedUsername',
    });
    expect(updatedUser?.username).toBe('updatedUsername');
  });

  it('deleteUser/ should delete a user', async () => {
    const user = await userRepository.createUser(userData);
    await userRepository.deleteUser(user._id.toString());
    const foundUser = await userRepository.getUserByEmail(userData.email);
    expect(foundUser).toBeNull();
  });
});
