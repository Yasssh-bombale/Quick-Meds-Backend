//https://ideogram.ai/api/images/direct/0lLf097zQPWvmMa5YyHkSg.png
import mongoose, { Schema, Document } from "mongoose";

enum statusType {
  pending = "pending",
  approved = "approved",
  rejected = "rejected",
}

interface storeSchemaObject extends Document {
  ownerId: mongoose.Schema.Types.ObjectId;
  ownerName: string;
  storeName: string;
  address: string;
  state: string;
  city: string;
  imageUrl?: string;
  mobileNumber: string;
  license: string;
  adharCard: string;
  ownerLivePicture: string;
  isApproved: boolean;
  status: statusType;
  rejectionReasons: string[];
}

const storeSchema: Schema<storeSchemaObject> = new Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: Object.values(statusType),
      default: statusType.pending,
    },
    license: {
      type: String,
      required: true,
    },
    ownerLivePicture: {
      type: String,
      required: true,
    },
    ownerName: {
      type: String,
      required: true,
    },
    storeName: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      default:
        "https://ideogram.ai/api/images/direct/0lLf097zQPWvmMa5YyHkSg.png",
    },
    mobileNumber: {
      type: String,
      required: true,
    },
    rejectionReasons: {
      type: [String],
    },
  },
  { timestamps: true }
);

export const Store = mongoose.model<storeSchemaObject>("Store", storeSchema);
