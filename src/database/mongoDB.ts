import mongoose from "mongoose";

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
