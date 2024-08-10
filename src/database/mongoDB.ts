import mongoose from "mongoose";
import User from "../models/user.model";
// import { Store } from "../models/store.model";

export const MongoConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string, {
      dbName: "Quick-Meds",
    });
    console.log(`MongoDB connected !`);
  } catch (error) {
    console.log(`ERROR:While connecting to mongoDB ${error}`);
  }
};
