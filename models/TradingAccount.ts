import { Schema, model, models, Document } from 'mongoose';

export interface ITradingAccount extends Document {
  userId: Schema.Types.ObjectId;
  balance: number; // Virtual cash
  totalProfit: number;
  portfolio: {
    symbol: string;
    quantity: number;
    averagePrice: number;
  }[];
  tradeHistory: {
    symbol: string;
    type: 'buy' | 'sell';
    quantity: number;
    price: number;
    timestamp: Date;
  }[];
}

const TradingAccountSchema = new Schema<ITradingAccount>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  balance: { type: Number, default: 100000 }, // Start with 1 Lakh virtual cash
  totalProfit: { type: Number, default: 0 },
  portfolio: [
    {
      symbol: String,
      quantity: { type: Number, default: 0 },
      averagePrice: { type: Number, default: 0 },
    }
  ],
  tradeHistory: [
    {
      symbol: String,
      type: { type: String, enum: ['buy', 'sell'] },
      quantity: Number,
      price: Number,
      timestamp: { type: Date, default: Date.now },
    }
  ]
}, { timestamps: true });

export default models.TradingAccount || model<ITradingAccount>('TradingAccount', TradingAccountSchema);