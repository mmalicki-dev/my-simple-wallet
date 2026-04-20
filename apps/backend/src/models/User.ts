import mongoose, { Document, Schema } from 'mongoose'
import bcrypt from 'bcryptjs'

export interface IRefreshToken {
  token: string
  expiresAt: Date
}

export interface IUser extends Document {
  email: string
  name: string
  password: string
  accounts: mongoose.Types.ObjectId[]
  isVerified: boolean
  verificationToken?: string
  passwordResetToken?: string
  passwordResetExpires?: Date
  pendingEmail?: string
  emailChangeToken?: string
  emailChangeExpires?: Date
  refreshTokens: IRefreshToken[]
  createdAt: Date
  updatedAt: Date
  comparePassword(candidate: string): Promise<boolean>
}

const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    accounts: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Account',
      },
    ],
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
    },
    passwordResetToken: {
      type: String,
    },
    passwordResetExpires: {
      type: Date,
    },
    pendingEmail: {
      type: String,
      lowercase: true,
      trim: true,
    },
    emailChangeToken: {
      type: String,
    },
    emailChangeExpires: {
      type: Date,
    },
    refreshTokens: [
      {
        token: { type: String, required: true },
        expiresAt: { type: Date, required: true },
      },
    ],
  },
  { timestamps: true },
)

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()
  this.password = await bcrypt.hash(this.password, 12)
  next()
})

UserSchema.methods.comparePassword = function (candidate: string): Promise<boolean> {
  return bcrypt.compare(candidate, this.password)
}

export default mongoose.model<IUser>('User', UserSchema)
