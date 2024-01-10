import mongoose, { CallbackError, Document, Model } from 'mongoose';
import bcrypt from 'bcrypt';

export interface IUser {
  username: string;
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

userSchema.pre<UserDocument>('save', async function preUserSave(next) {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const user = this; // Schema

  if (!user.isModified('password')) {
    // 비밀번호 변경 없으면 next();
    return next();
  }

  try {
    const saltRounds = 12; // salt rounds
    const salt = await bcrypt.genSalt(saltRounds); // salt 추가
    const hashed = await bcrypt.hash(user.password, salt); // hash
    this.password = hashed;
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
