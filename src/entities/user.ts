import mongoose, { Document, Model } from 'mongoose';
import AuthService from '@src/util/AuthService';

export enum ROLE {
  'ADMIN' = 1,
  'USER' = 2
}

export interface User {
  _id?: string;
  name: string;
  email: string;
  password: string;
  active: boolean;
  role: ROLE;
}

const schema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    password: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: [true, 'Email must be unique'],
    },
    role: {
      type: Number,
      required: true,
      default: ROLE.USER,
    },
    active: { type: Boolean, required: true, default: true },
  },
  {
    toJSON: {
      transform: (_, ret): void => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  },
);

export enum CUSTOM_VALIDATION {
  DUPLICATED = 'DUPLICATED',
}

schema.path('email').validate(
  async (email: string) => {
    const emailCount = await mongoose.models.User.countDocuments({ email });
    return !emailCount;
  },
  'already exists in the database.',
  CUSTOM_VALIDATION.DUPLICATED,
);

schema.pre<UserModel>('save', async function(): Promise<void> {
  if (!this.password || !this.isModified('password')) {
    return;
  }
  try {
    const hashedPassword = await AuthService.hashPassword(this.password);
    this.password = hashedPassword;
  } catch (err) {
    console.log(`Error hashing the password for the user ${this.name}`, err);
  }
});

schema.pre<UserModel>('findOneAndUpdate', async function(): Promise<void> {
  try {
    const hashedPassword = await AuthService.hashPassword(this._update.password);
    this._update.password = hashedPassword;
  } catch (err) {
    console.log(`Error hashing the password for the user ${this._update.name}`, err);
  }
});

interface UserModel extends Omit<User, '_id'>, Document {
}

export const User: Model<UserModel> = mongoose.model('User', schema);
