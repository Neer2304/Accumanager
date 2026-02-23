// models/BlogPost.ts
import mongoose, { Schema, Document } from 'mongoose'

export interface IBlogPost extends Document {
  title: string
  slug: string
  excerpt: string
  content: string
  author: {
    name: string
    avatar?: string
    role: string
  }
  categoryId: mongoose.Types.ObjectId
  tags: string[]
  coverImage?: string
  readTime: number
  featured: boolean
  published: boolean
  publishedAt?: Date
  views: number
  likes: number
  createdAt: Date
  updatedAt: Date
}

const BlogPostSchema = new Schema({
  title: { 
    type: String, 
    required: [true, 'Post title is required'] 
  },
  slug: { 
    type: String, 
    required: [true, 'Post slug is required'], 
    unique: true,
    lowercase: true,
    trim: true
  },
  excerpt: { 
    type: String, 
    required: [true, 'Post excerpt is required'] 
  },
  content: { 
    type: String, 
    required: [true, 'Post content is required'] 
  },
  author: {
    name: { 
      type: String, 
      required: [true, 'Author name is required'] 
    },
    avatar: { 
      type: String 
    },
    role: { 
      type: String, 
      default: 'Author' 
    }
  },
  categoryId: { 
    type: Schema.Types.ObjectId, 
    ref: 'BlogCategory', 
    required: [true, 'Category ID is required'] 
  },
  tags: [{ 
    type: String 
  }],
  coverImage: { 
    type: String 
  },
  readTime: { 
    type: Number, 
    default: 5 
  },
  featured: { 
    type: Boolean, 
    default: false 
  },
  published: { 
    type: Boolean, 
    default: false 
  },
  publishedAt: { 
    type: Date 
  },
  views: { 
    type: Number, 
    default: 0 
  },
  likes: { 
    type: Number, 
    default: 0 
  }
}, { 
  timestamps: true 
})

// Calculate read time before saving
BlogPostSchema.pre('save', function(next) {
  if (this.content) {
    const wordsPerMinute = 200
    const wordCount = this.content.split(/\s+/).length
    this.readTime = Math.ceil(wordCount / wordsPerMinute)
  }
  next()
})

// Auto-set publishedAt when publishing
BlogPostSchema.pre('save', function(next) {
  if (this.published && !this.publishedAt) {
    this.publishedAt = new Date()
  }
  next()
})

export default mongoose.models.BlogPost || mongoose.model<IBlogPost>('BlogPost', BlogPostSchema)