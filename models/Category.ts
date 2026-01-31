// models/Category.ts
import mongoose, { Schema, Document } from "mongoose";

export interface ICategory extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  description?: string;
  parentCategory?: mongoose.Types.ObjectId;
  subCategories: mongoose.Types.ObjectId[];
  icon: string;
  color: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    parentCategory: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      default: null,
    },
    subCategories: [{
      type: Schema.Types.ObjectId,
      ref: "Category",
    }],
    icon: {
      type: String,
      default: "category",
    },
    color: {
      type: String,
      default: "#2563eb",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
CategorySchema.index({ userId: 1, name: 1 }, { unique: true });
CategorySchema.index({ userId: 1, parentCategory: 1 });
CategorySchema.index({ userId: 1, isActive: 1 });

export default mongoose.models.Category ||
  mongoose.model<ICategory>("Category", CategorySchema);