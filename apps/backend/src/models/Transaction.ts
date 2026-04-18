import mongoose, { Document, Schema } from "mongoose";
import { CategoryType } from "./Category.js";

export interface ITransaction extends Document {
  user: mongoose.Types.ObjectId;
  account: mongoose.Types.ObjectId;
  amount: number;
  type: CategoryType;
  category: mongoose.Types.ObjectId;
  description?: string;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}

const TransactionSchema = new Schema<ITransaction>(
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
    amount: {
      type: Number,
      required: true,
      min: 0.01,
    },
    type: {
      type: String,
      enum: ["income", "expense"],
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
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

TransactionSchema.pre("save", async function (next) {
  if (!this.isNew && !this.isModified("amount") && !this.isModified("type"))
    return next();

  const Account = mongoose.model("Account");
  const account = await Account.findById(this.account);
  if (!account) return next();

  const delta = this.type === "income" ? this.amount : -this.amount;
  await Account.findByIdAndUpdate(this.account, { $inc: { balance: delta } });

  next();
});

export default mongoose.model<ITransaction>("Transaction", TransactionSchema);
