// models/BlogCategory.ts
import mongoose, { Schema, Document } from 'mongoose'

export interface IBlogCategory extends Document {
  name: string
  slug: string
  description?: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

const BlogCategorySchema = new Schema({
  name: { 
    type: String, 
    required: [true, 'Category name is required'] 
  },
  slug: { 
    type: String, 
    required: [true, 'Category slug is required'], 
    unique: true,
    lowercase: true,
    trim: true
  },
  description: { 
    type: String 
  },
  isActive: { 
    type: Boolean, 
    default: true 
  }
}, { 
  timestamps: true 
})

export default mongoose.models.BlogCategory || mongoose.model<IBlogCategory>('BlogCategory', BlogCategorySchema)