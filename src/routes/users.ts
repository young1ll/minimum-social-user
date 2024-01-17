import { UserContoller } from '@/controllers';
import {
  ValidateReturn,
  passwordValidation,
  usernameValidation,
  withIsVerifiedByEmailParam,
} from '@/middleware';
import { USERS_ROUTE, USER_ROUTE } from '@/routes/definitions';
import { Request, Response, Router } from 'express';

const UserRouter = Router();

// GET ALL USERS
UserRouter.get(USERS_ROUTE, UserContoller.getUsers);

// TEST UserRouter.get(USER_ROUTE, UserContoller.getUsers); // 전체 사용자 조회: pagenation, filter, sorting
UserRouter.get(USER_ROUTE, async (req: Request, res: Response) => {
  console.log({
    message: 'User route test.',
    will: 'be request for get all users',
  }); // endpoint 테스트
});

// GET A USER
UserRouter.get(`${USER_ROUTE}/:userEmail`, UserContoller.getUser);

// CREATE A USER
UserRouter.post(USER_ROUTE, UserContoller.createUser);

// UPDATE USERNAME
UserRouter.put(
  `${USER_ROUTE}/:userEmail`,
  [usernameValidation],
  ValidateReturn,
  UserContoller.updateUserName,
);

// UPDATE PASSWORD
UserRouter.put(
  `${USER_ROUTE}/:userEmail/password`,
  [passwordValidation],
  ValidateReturn,
  UserContoller.updateUserPassword,
);

// RESET PASSWORD
UserRouter.post(
  `${USER_ROUTE}/reset-password`,
  [passwordValidation],
  ValidateReturn,
  UserContoller.resetUserPassword,
);

// DELETE A USER
UserRouter.delete(`${USER_ROUTE}/:userEmail`, UserContoller.deleteUser); // RESTful Delete

export default UserRouter;
