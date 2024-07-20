import mongoose, { Schema, Document } from "mongoose";

enum UserRole {
  user = "user",
  owner = "owner",
}
enum MessageType {
  message = "message",
  order = "order",
}
interface conversationSchemaObject extends Document {
  storeId: mongoose.Schema.Types.ObjectId;
  userId: mongoose.Schema.Types.ObjectId;
  type: MessageType;
  amount: String;
  role: UserRole;
  message: string;
  senderName: string;
  senderProfile: string;
  prescriptionImage: string;
}

const ConversationSchema: Schema<conversationSchemaObject> = new Schema(
  {
    storeId: mongoose.Schema.Types.ObjectId,
    userId: mongoose.Schema.Types.ObjectId,
    type: {
      type: String,
      enum: Object.values(MessageType),
      default: MessageType.message,
      required: true,
    },
    amount: {
      type: String,
      default: "0",
    },
    role: {
      type: String,
      enum: Object.values(UserRole),
      required: true,
    },
    prescriptionImage: {
      type: String,
    },
    message: {
      type: String,
      required: true,
    },
    senderName: {
      type: String,
      required: true,
    },
    senderProfile: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Conversation = mongoose.model<conversationSchemaObject>(
  "Conversation",
  ConversationSchema
);

export default Conversation;
