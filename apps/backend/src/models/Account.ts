import mongoose, { Document, Schema } from "mongoose";

export interface IAccount extends Document {
  user: mongoose.Types.ObjectId;
  name: string;
  type: string;
  balance: number;
  currency: string;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const AccountSchema = new Schema<IAccount>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    balance: {
      type: Number,
      default: 0,
    },
    type: {
      type: String,
      default: "debit",
      trim: true,
    },
    currency: {
      type: String,
      default: "NOK",
      trim: true,
      uppercase: true,
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

export default mongoose.model<IAccount>("Account", AccountSchema);
