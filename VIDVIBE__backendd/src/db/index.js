import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";
import { APIERROR } from "../utils/APIError.js";
import dotenv from "dotenv";

dotenv.config({
  path: "./path/to/.env",
});

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      // eslint-disable-next-line no-undef
      `${process.env.CONNECTDATABASE}/${DB_NAME}`
    );
    console.log(`MongoDb Connected!! ${connectionInstance.connection.host}`);
  } catch (err) {
    throw new APIERROR(
      401,
      "Something went wrong while connecting to the database!!!",
      console.log(err)
    );
  }
};

export default connectDB;
