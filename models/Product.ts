// models/Product.js - UPDATED TO FIX SKU ISSUE
import mongoose from 'mongoose'

const variationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    default: 'Default'
  },
  sku: {
    type: String,
    sparse: true // Allows multiple nulls
  },
  price: {
    type: Number,
    required: true
  },
  costPrice: {
    type: Number,
    default: 0
  },
  stock: {
    type: Number,
    default: 0
  },
  weight: Number,
  dimensions: {
    length: Number,
    width: Number,
    height: Number
  }
})

const batchSchema = new mongoose.Schema({
  batchNumber: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  costPrice: {
    type: Number,
    required: true
  },
  sellingPrice: {
    type: Number,
    required: true
  },
  mfgDate: Date,
  expDate: Date,
  receivedDate: {
    type: Date,
    default: Date.now
  }
})

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  sku: {
    type: String,
    sparse: true, // FIX: Allows multiple nulls but unique for non-null values
    unique: true
  },
  description: String,
  category: {
    type: String,
    required: true
  },
  subCategory: String,
  brand: String,
  basePrice: {
    type: Number,
    required: true
  },
  baseCostPrice: {
    type: Number,
    default: 0
  },
  gstDetails: {
    type: {
      type: String,
      enum: ['cgst_sgst', 'igst', 'utgst'],
      default: 'cgst_sgst'
    },
    hsnCode: {
      type: String,
      required: true
    },
    cgstRate: {
      type: Number,
      default: 0
    },
    sgstRate: {
      type: Number,
      default: 0
    },
    igstRate: {
      type: Number,
      default: 0
    },
    utgstRate: {
      type: Number,
      default: 0
    }
  },
  variations: [variationSchema],
  batches: [batchSchema],
  tags: [String],
  isReturnable: {
    type: Boolean,
    default: false
  },
  returnPeriod: {
    type: Number,
    default: 0
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
})

// Auto-generate SKU before saving
productSchema.pre('save', function(next) {
  if (!this.sku) {
    const namePart = this.name.replace(/\s+/g, '').substring(0, 6).toUpperCase()
    const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase()
    this.sku = `${namePart}-${randomPart}`
  }
  next()
})

export default mongoose.models.Product || mongoose.model('Product', productSchema)