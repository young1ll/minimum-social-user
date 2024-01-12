/**
 * User Model
 * 사용자 핵심정보만 취급하고, Sequelize 또는 TypedORM으로 연결(예정)
 * UserDetail Model과 연결
 */
import mongoose, {
  CallbackWithoutResultAndOptionalError,
  Document,
  Model,
  Query,
} from 'mongoose';
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

const userSchema = new mongoose.Schema(
  {
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
    verified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);
userSchema.index({ email: 'text', username: 'text' });

// 생성, 업데이트 시 pre-hook 실행 #8
userSchema.pre<UserDocument>('save', async function preFunc(next) {
  if (!this.isModified('password') || this.isNew) {
    return next();
  }

  try {
    this.password = await defaultHash({ password: this.password });
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
