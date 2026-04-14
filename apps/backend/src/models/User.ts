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
  balance: number
  isVerified: boolean
  verificationToken?: string
  passwordResetToken?: string
  passwordResetExpires?: Date
  refreshTokens: IRefreshToken[]
  transactions: mongoose.Types.ObjectId[]
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
    balance: {
      type: Number,
      default: 0,
    },
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
    refreshTokens: [
      {
        token: { type: String, required: true },
        expiresAt: { type: Date, required: true },
      },
    ],
    transactions: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Transaction',
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
