import mongoose, { Schema, Document } from "mongoose";

interface orderSchemaObject extends Document {
  storeId: mongoose.Schema.Types.ObjectId;
  userId: mongoose.Schema.Types.ObjectId;
  orderedBy: string; //userName
  userProfile: string;
  prescriptionImage: string;
  prescription: string;
  city: string;
  state: string;
  address: string;
}

const OrderSchema: Schema<orderSchemaObject> = new Schema(
  {
    storeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Store",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    orderedBy: {
      type: String, //userName
      required: true,
    },
    userProfile: {
      type: String,
      required: true,
    },
    prescriptionImage: {
      type: String,
      required: true,
    },
    prescription: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Order = mongoose.model<orderSchemaObject>("Order", OrderSchema);

export default Order;
