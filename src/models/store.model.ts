//https://ideogram.ai/api/images/direct/0lLf097zQPWvmMa5YyHkSg.png
import mongoose, { Schema, Document } from "mongoose";

interface storeSchemaObject extends Document {
  storeName: string;
  address: string;
  state: string;
  city: string;
  imageUrl: string;
  mobileNumber: string;
}

const storeSchema: Schema<storeSchemaObject> = new Schema(
  {
    storeName: {
      type: String,
      required: true,
      unique: true,
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
  },
  { timestamps: true }
);

export const Store = mongoose.model("Store", storeSchema);
