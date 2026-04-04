import mongoose from "mongoose";

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: "Commerce_Store",
    });
    console.log("Database Connected Successfully ");
  } catch (error) {
    console.log(`Database error: ${error}`);
    process.exit(1);
  }
};

module.exports = connectDb;
