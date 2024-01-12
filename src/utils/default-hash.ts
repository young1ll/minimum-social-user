import bcrypt from 'bcrypt';

/**
 * 항상 동일한 솔트를 적용
 */
const SALT_ROUND = 12;

export const defaultHash = async ({ password }: { password: string }) => {
  try {
    const salt = await bcrypt.genSalt(SALT_ROUND); // salt 생성 시 비교 불가
    const hashed = await bcrypt.hash(password, salt); // hash
    return hashed;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const defaultCompare = async ({
  password,
  hashedPassword,
}: {
  password: string;
  hashedPassword: string;
}) => {
  try {
    return await bcrypt.compare(password, hashedPassword);
  } catch (error) {
    console.error(error);
    throw error;
  }
};
