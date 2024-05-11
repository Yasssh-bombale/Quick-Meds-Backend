import mongoose, { Schema, Document } from "mongoose";

interface orderSchemaObject extends Document {
  storeId: mongoose.Schema.Types.ObjectId;
  userId: mongoose.Schema.Types.ObjectId;
  orderedBy: string; //userName
  userProfile: string;
  customerMobileNumber: string;
  prescriptionImage: string;
  prescription: string;
  deliveryCity: string;
  deliveryState: string;
  deliveryAddress: string;
  isOrderPlaced: boolean;
  isOrderOutOffStock: boolean;
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
    customerMobileNumber: {
      type: String,
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
    deliveryCity: {
      type: String,
      required: true,
    },
    deliveryState: {
      type: String,
      required: true,
    },
    deliveryAddress: {
      type: String,
      required: true,
    },
    isOrderPlaced: {
      type: Boolean,
      default: false,
    },
    isOrderOutOffStock: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Order = mongoose.model<orderSchemaObject>("Order", OrderSchema);

export default Order;
