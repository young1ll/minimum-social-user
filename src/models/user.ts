/**
 * User Model
 * 사용자 핵심정보만 취급하고, Sequelize 또는 TypedORM으로 연결(예정)
 * UserDetail Model과 연결
 */
import mongoose, { Document, Model } from 'mongoose';
import bcrypt from 'bcrypt';
import { defaultHash } from '@/utils/default-hash';

export interface IUser {
  username: string;
  // nickname: string;
  // phone: string;
  // profileImage: string;
  email: string;
  password: string;
}

export interface UserDocument extends IUser, Document {}
export interface UserModel extends Model<UserDocument> {}

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  // nickname: {
  //   type: String,
  //   required: true,
  //   unique: true,
  // },
  // phone: {
  //   type: String,
  //   unique: true,
  // },
  // profileImage: {
  //   type: String,
  //   required: true,
  // },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});
userSchema.index({ email: 'text', username: 'text' });

userSchema.pre<UserDocument>('save', async function preUserSave(next) {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const user = this; // Schema

  if (!user.isModified('password')) {
    return next();
  }

  try {
    user.password = await defaultHash({ password: user.password });
    return next();
  } catch (err) {
    if (err instanceof Error) {
      return next(err);
    }
    // TODO: report Error Exception
    return next();
  }
});

const User = mongoose.model<UserDocument, UserModel>('User', userSchema);
export default User;
