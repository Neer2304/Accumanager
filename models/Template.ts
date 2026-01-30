// models/Template.ts
import mongoose, { Schema, Document } from "mongoose";

export interface ITemplate extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  description: string;
  category: "standard" | "professional" | "minimal" | "modern";
  settings: {
    colors: {
      primary: string;
      secondary: string;
      background: string;
      text: string;
    };
    layout: {
      spacing: "compact" | "normal" | "relaxed";
      borderRadius: string;
      shadows: boolean;
    };
    fields: {
      header: boolean;
      footer: boolean;
      logo: boolean;
      signature: boolean;
      terms: boolean;
      watermark: boolean;
      qrCode: boolean;
    };
    isDefault: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

const TemplateSchema: Schema = new Schema(
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
    category: {
      type: String,
      enum: ["standard", "professional", "minimal", "modern"],
      default: "standard",
    },
    settings: {
      colors: {
        primary: {
          type: String,
          default: "#2563eb",
        },
        secondary: {
          type: String,
          default: "#64748b",
        },
        background: {
          type: String,
          default: "#ffffff",
        },
        text: {
          type: String,
          default: "#1f2937",
        },
      },
      layout: {
        spacing: {
          type: String,
          enum: ["compact", "normal", "relaxed"],
          default: "normal",
        },
        borderRadius: {
          type: String,
          default: "8px",
        },
        shadows: {
          type: Boolean,
          default: true,
        },
      },
      fields: {
        header: { type: Boolean, default: true },
        footer: { type: Boolean, default: true },
        logo: { type: Boolean, default: true },
        signature: { type: Boolean, default: true },
        terms: { type: Boolean, default: true },
        watermark: { type: Boolean, default: false },
        qrCode: { type: Boolean, default: false },
      },
      isDefault: {
        type: Boolean,
        default: false,
      },
    },
  },
  {
    timestamps: true,
  }
);

// Ensure only one default template per user
TemplateSchema.pre("save", async function (next) {
  if (this.settings.isDefault) {
    await mongoose.model("Template").updateMany(
      { userId: this.userId, _id: { $ne: this._id } },
      { $set: { "settings.isDefault": false } }
    );
  }
  next();
});

export default mongoose.models.Template ||
  mongoose.model<ITemplate>("Template", TemplateSchema);