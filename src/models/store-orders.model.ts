import mongoose, { Schema, Document } from "mongoose";

enum PaymentMode {
  online = "online",
  cash = "cash",
}

interface orderSchemaObject extends Document {
  conversationId: mongoose.Schema.Types.ObjectId;
  storeId: mongoose.Schema.Types.ObjectId;
  userId: mongoose.Schema.Types.ObjectId;
  razorpay_paymentId: string;
  paymentMode: PaymentMode;
  storeName: string;
  orderedBy: string; //userName
  userProfile: string;
  customerMobileNumber: string;
  prescriptionImage: string;
  prescription: string;
  deliveryCity: string;
  deliveryState: string;
  deliveryAddress: string;
}

const OrderSchema: Schema<orderSchemaObject> = new Schema(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },
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
    razorpay_paymentId: {
      type: String,
    },
    paymentMode: {
      type: String,
      enum: Object.values(PaymentMode),
      required: true,
    },
    storeName: {
      type: String,
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
  },
  { timestamps: true }
);

const Order = mongoose.model<orderSchemaObject>("Order", OrderSchema);

export default Order;
