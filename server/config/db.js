const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    mongoose.set('strictQuery', false);
    // This looks for MONGO_URI in your .env file
    await mongoose.connect(process.env.MONGO_URI, {
      // Force IPv4 if Node tries to use IPv6 and fails
      family: 4, 
    });
    console.log("✅ MongoDB Connected Successfully!");
  } catch (err) {
    console.error("❌ MONGODB CONNECTION ERROR:");
    console.error(err.message);

    // If the DB fails, we stop the server so you know immediately
    process.exit(1);
  }
};

module.exports = connectDB;
