import { UserRepository } from '@/repositories';
import { IAuthUser, IUserData } from '@/repositories/user-repo';

const UserService = () => {
  const userRepo = UserRepository();

  const getUsers = async () => {
    const data = await userRepo.getUsers();

    return data.Items;
  };

  const findByEmail = async (email: Pick<IAuthUser, 'sk'>) => {
    const data = await userRepo.findByEmail(email);

    if (data) return data;

    return data;
  };

  const create = async (user: IAuthUser & Partial<IUserData>) => {
    const result = await userRepo.create({
      ...user,
    });

    return result;
  };

  const update = async (user: IAuthUser, data: Partial<IUserData>) => {
    const result = await userRepo.update(user, data);

    return result;
  };

  const deleteById = async (userId: Pick<IAuthUser, 'pk'>) => {
    const result = await userRepo.deleteById(userId);

    return result;
  };

  return {
    create,
    getUsers,
    findByEmail,
    update,
    deleteById,
  };
};

export default UserService;
