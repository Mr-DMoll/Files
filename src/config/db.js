// MongoDB connection setup
import mongoose from "mongoose";

/**
 * Establishes a connection to the MongoDB database.
 */
const connectToDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Database connection established");
  } catch (error) {
    console.log(`Failed to connect to database : ${error.message}`);
    process.exit(1);
  }
};

export default connectToDB;
