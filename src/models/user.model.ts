import mongoose, { Schema, Document } from "mongoose";

interface userSchemaObject extends Document {
  username: string;
  email: string;
  password: string;
  profilePicture: string;
  isAdmin: boolean;
}

const userSchema: Schema<userSchemaObject> = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    profilePicture: {
      type: String,
      default:
        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const User = mongoose.model<userSchemaObject>("User", userSchema);

export default User;
