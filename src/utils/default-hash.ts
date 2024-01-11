import bcrypt from 'bcrypt';

export const defaultHash = async ({ password }: { password: string }) => {
  const saltRounds = 12; // salt rounds
  const salt = await bcrypt.genSalt(saltRounds); // salt 추가
  const hashed = await bcrypt.hash(password, salt); // hash
  return hashed;
};
