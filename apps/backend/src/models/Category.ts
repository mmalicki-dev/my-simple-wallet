import mongoose, { Document, Schema } from 'mongoose'

export type CategoryType = 'income' | 'expense'

export interface ICategory extends Document {
  name: string
  type: CategoryType
  icon: string
  color: string
  user: mongoose.Types.ObjectId | null
  isDefault: boolean
  createdAt: Date
  updatedAt: Date
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
      enum: ['income', 'expense'],
      required: true,
    },
    icon: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
)

export default mongoose.model<ICategory>('Category', CategorySchema)
