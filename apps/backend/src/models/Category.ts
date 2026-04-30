import mongoose, { Document, Schema } from "mongoose";
import { TransactionType } from "shared/src/index.js";

export interface ICategory extends Document {
  name: string;
  type: TransactionType;
  icon: string;
  colour: string;
  user: mongoose.Types.ObjectId | null;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema = new Schema<ICategory>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ["income", "expense"] satisfies TransactionType[],
      required: true,
    },
    icon: {
      type: String,
      default: "default",
    },
    colour: {
      type: String,
      default: "#808080",
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

export default mongoose.model<ICategory>("Category", CategorySchema);
