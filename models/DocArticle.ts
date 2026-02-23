// models/DocArticle.ts
import mongoose, { Schema, Document } from 'mongoose'

export interface IDocArticle extends Document {
  title: string
  slug: string
  description: string
  content: string
  categoryId: mongoose.Types.ObjectId
  order: number
  isActive: boolean
  views: number
  createdAt: Date
  updatedAt: Date
}

const DocArticleSchema = new Schema({
  title: { 
    type: String, 
    required: [true, 'Article title is required'] 
  },
  slug: { 
    type: String, 
    required: [true, 'Article slug is required'], 
    unique: true,
    lowercase: true,
    trim: true
  },
  description: { 
    type: String, 
    required: [true, 'Article description is required'] 
  },
  content: { 
    type: String, 
    required: [true, 'Article content is required'] 
  },
  categoryId: { 
    type: Schema.Types.ObjectId, 
    ref: 'DocCategory', 
    required: [true, 'Category ID is required'] 
  },
  order: { 
    type: Number, 
    default: 0 
  },
  isActive: { 
    type: Boolean, 
    default: true 
  },
  views: { 
    type: Number, 
    default: 0 
  }
}, { 
  timestamps: true 
})

// Increment views when article is viewed
DocArticleSchema.methods.incrementViews = function() {
  this.views += 1
  return this.save()
}

export default mongoose.models.DocArticle || mongoose.model<IDocArticle>('DocArticle', DocArticleSchema)