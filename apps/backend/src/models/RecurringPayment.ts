import mongoose, { Document, Schema } from "mongoose";

export type RecurringPaymentType = "subscription" | "loan";
export type BillingCycle = "weekly" | "monthly" | "yearly";

export interface IRecurringPayment extends Document {
  user: mongoose.Types.ObjectId;
  account: mongoose.Types.ObjectId;
  name: string;
  amount: number;
  type: RecurringPaymentType;
  billingCycle: BillingCycle;
  nextDueDate: Date;
  category: mongoose.Types.ObjectId;
  description?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const RecurringPaymentSchema = new Schema<IRecurringPayment>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    account: {
      type: Schema.Types.ObjectId,
      ref: "Account",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0.01,
    },
    type: {
      type: String,
      enum: ["subscription", "loan"],
      required: true,
    },
    billingCycle: {
      type: String,
      enum: ["weekly", "monthly", "yearly"],
      required: true,
    },
    nextDueDate: {
      type: Date,
      required: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    description: {
      type: String,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model<IRecurringPayment>("RecurringPayment", RecurringPaymentSchema);
