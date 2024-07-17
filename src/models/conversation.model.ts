import mongoose, { Schema, Document } from "mongoose";

enum UserRole {
  user = "user",
  owner = "owner",
}

interface conversationSchemaObject extends Document {
  storeId: mongoose.Schema.Types.ObjectId;
  userId: mongoose.Schema.Types.ObjectId;
  role: UserRole;
  message: string;
  prescriptionImage: string;
}

const ConversationSchema: Schema<conversationSchemaObject> = new Schema(
  {
    storeId: mongoose.Schema.Types.ObjectId,
    userId: mongoose.Schema.Types.ObjectId,
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
  },
  { timestamps: true }
);

const Conversation = mongoose.model<conversationSchemaObject>(
  "Conversation",
  ConversationSchema
);

export default Conversation;
