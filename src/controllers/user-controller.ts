import { UserService } from '@/services';
import { defaultCompare, defaultHash } from '@/utils/default-hash';
import { Request, Response } from 'express';
import { validationResult } from 'express-validator';

const userService = new UserService();

export const getUser = async (req: Request, res: Response) => {
  try {
    const { email } = req.currentUser;

    const user = await userService.getUserByEmail({
      email,
    });

    return res.status(200).send({ user });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: 'Internal server error.' });
  }
};

export const updateUserName = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors });
  }

  try {
    // currentUser data 필요 없으므로 그냥 userEmail 사용
    const { userEmail } = req.params;
    const { username: updatedUsername } = req.body;

    const updatedUser = await userService.updateUsername({
      email: userEmail,
      username: updatedUsername,
    });

    return res.status(200).send({ updatedUser });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: 'Internal server error.' });
  }
};

export const updateUserPassword = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors });
  }

  try {
    const { userEmail } = req.params;
    const { currentPassword, newPassword } = req.body; // TODO: 인증
    const { password } = req.currentUser;

    // 기존 비밀번호 검증
    const isCurrentMatch = await defaultCompare({
      password: currentPassword,
      hashedPassword: password,
    });
    if (!isCurrentMatch) {
      return res
        .status(400)
        .send({ error: `Incorrect password provided: ${currentPassword}` });
    }
    // 새 비밀번호와 기존 비밀번호가 같은 경우
    const isNewMatch = await defaultCompare({
      password: newPassword,
      hashedPassword: password,
    });
    if (isNewMatch) {
      return res.status(400).send({
        error: `New password is same with current password`,
        newPassword,
      });
    }

    // 새로운 비밀번호 해싱
    const hashedNew = await defaultHash({
      password: newPassword,
    });

    // 업데이트
    const updatedUser = await userService.updateUserData({
      email: userEmail,
      password: hashedNew, // 반드시 hash된 값을 저장
    });

    return res
      .status(200)
      .send({ message: 'User password updated successfully.', updatedUser });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: 'Internal server error.', error });
  }
};

/**
 * 작성 중...
 */
export const resetUserPassword = async (req: Request, res: Response) => {
  try {
    const { email, newPassword } = req.body; // TODO: 인증

    return res
      .status(200)
      .send({ message: 'User password reset successfully.' });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: 'Internal server error.' });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { userEmail } = req.params;

    const { _id } = req.currentUser;

    await userService.deleteUser({
      id: _id,
    });
    return res.status(200).send({ message: 'User deleted successfully.' });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: 'Internal server error.' });
  }
};
