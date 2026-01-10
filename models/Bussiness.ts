// models/Business.ts
import { Schema, model, models, Document } from 'mongoose'

export interface IBusiness extends Document {
  businessName: string
  address: string
  city: string
  state: string
  pincode: string
  country: string
  gstNumber: string
  phone: string
  email: string
  logo?: string
  userId: string
  createdAt: Date
  updatedAt: Date
}

const BusinessSchema = new Schema({
  businessName: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  pincode: { type: String, required: true },
  country: { type: String, default: 'India' },
  gstNumber: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  logo: String,
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, {
  timestamps: true
})

export default models.Business || model<IBusiness>('Business', BusinessSchema)