import DatabaseError from '@/errors/db-error';
import { UserService } from '@/services/';

describe('Userervice', () => {
  const userService = new UserService();

  const userData = {
    email: 'testEmail',
    password: 'testPassword', // will be hashed
  };
  const userDataWithUsername = {
    ...userData,
    username: 'testUsername',
  };

  // Error: 중복된 회원
  it('createUser / should throw Database Error when user is duplicated', async () => {
    try {
      await userService.createUser(userData);
      const result = await userService.createUser(userData);
      if (result) {
        fail('Expected DatabaseError but no error was thrown.');
      }
    } catch (error) {
      expect(error).toBeInstanceOf(DatabaseError);
    }
  });

  it('createUser / should create and save a new user without username', async () => {});

  it('createUser / should create and save a new user with username', async () => {});

  it('getUserByEmail / should return a user', async () => {
    await userService.createUser(userData);
    const result = await userService.getUserByEmail({ email: userData.email });
    expect(result?.email).toEqual(userData.email);
  });

  it('getUserByUsername / should return a user', async () => {
    await userService.createUser(userDataWithUsername);

    const result = await userService.getUserByUsername({
      username: userDataWithUsername.username,
    });

    expect(result?.username).toEqual(userDataWithUsername.username);
  });

  it('getAllUsersByEmailAndUsername / should return searched all users', async () => {
    const testUsers = [
      {
        email: 'testEmail1',
        password: 'testPassword',
      },
      {
        email: 'testEmail2',
        password: 'testPassword2',
      },
      {
        email: 'testEmail3',
        password: 'testPassword3',
      },
    ];
    await Promise.all(
      testUsers.map(async (user) => {
        await userService.createUser(user);
      }),
    );
    const search = await userService.getAllUsersByEmailAndUsername({
      query: 'te',
    });
    expect(search).toHaveLength(3);
  });

  it('getAllUsersByEmailAndUsername / should return an empty array', async () => {
    await userService.createUser(userData);
    await userService.createUser(userDataWithUsername);

    expect(
      await userService.getAllUsersByEmailAndUsername({ query: 'post' }),
    ).toHaveLength(0);
  });

  it('updateUserData / should update a user username', async () => {
    await userService.createUser(userData);
    const result = await userService.updateUserData({
      email: userData.email,
      username: 'updatedUsername',
    });

    expect(result?.username).toEqual('updatedUsername');
  });

  it('updateUserData / should update a user password', async () => {
    const user = await userService.createUser(userData);
    const result = await userService.updateUserData({
      email: userData.email,
      password: 'updatedPassword',
    });

    expect(user?.password).not.toBe(result?.password);
  });

  it('updateUsername / should update a user username', async () => {
    await userService.createUser(userDataWithUsername);
    const result = await userService.updateUsername({
      email: userDataWithUsername.email,
      username: 'updatedUsername',
    });

    expect(result?.username).toEqual('updatedUsername');
  });

  // 회원 탈퇴
  it('deleteUser / should delete a user', async () => {
    const user = await userService.createUser(userData);
    console.log(user);

    await userService.deleteUser({ id: user?._id.toString() });

    const result = await userService.getUserByEmail({ email: userData.email });
    expect(result).toBeNull();
  });
});
