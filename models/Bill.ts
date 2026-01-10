// models/Bill.ts
import { Schema, model, models } from 'mongoose'

const BillItemSchema = new Schema({
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  gstRate: { type: Number, required: true },
  total: { type: Number, required: true },
})

const BillSchema = new Schema({
  billNumber: { type: String, required: true, unique: true },
  customerId: { type: Schema.Types.ObjectId, ref: 'Customer' },
  customerName: { type: String, required: true },
  items: [BillItemSchema],
  subtotal: { type: Number, required: true },
  totalGst: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  totalAmount: { type: Number, required: true },
  paymentMethod: { type: String, enum: ['cash', 'card', 'upi', 'credit'], required: true },
  status: { type: String, enum: ['pending', 'paid', 'cancelled'], default: 'paid' },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
})

export default models.Bill || model('Bill', BillSchema)