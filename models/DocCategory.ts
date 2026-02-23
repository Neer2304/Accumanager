// models/DocCategory.ts
import mongoose, { Schema, Document } from 'mongoose'

export interface IDocCategory extends Document {
  name: string
  slug: string
  description: string
  icon: string
  order: number
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

const DocCategorySchema = new Schema({
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
    type: String, 
    required: [true, 'Category description is required'] 
  },
  icon: { 
    type: String, 
    default: 'description' 
  },
  order: { 
    type: Number, 
    default: 0 
  },
  isActive: { 
    type: Boolean, 
    default: true 
  }
}, { 
  timestamps: true 
})

export default mongoose.models.DocCategory || mongoose.model<IDocCategory>('DocCategory', DocCategorySchema)