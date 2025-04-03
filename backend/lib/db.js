import mongoose from "mongoose";
import dotenv from "dotenv";

const connectDb = async () => {
  try {
    const connect = await mongoose.connect(process.env.MONGO_URI);
    console.log("Mongo db connected");
  } catch (error) {
    console.log(error.message);
  }
};

export default connectDb;
