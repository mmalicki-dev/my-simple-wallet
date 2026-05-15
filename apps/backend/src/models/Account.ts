import mongoose, { Document, Schema } from "mongoose";
import { CURRENCIES, Currency } from "../../../../packages/shared/dist/index.js";

export interface IAccount extends Document {
  user: mongoose.Types.ObjectId;
  name: string;
  type: "debit" | "credit";
  balance: number;
  currency: Currency;
  isDefault: boolean;
  includeInTotal: boolean;
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
      enum: ["debit", "credit"],
      default: "debit",
      trim: true,
    },
    includeInTotal: {
      type: Boolean,
      default: true,
    },
    currency: {
      type: String,
      enum: [...CURRENCIES],
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
