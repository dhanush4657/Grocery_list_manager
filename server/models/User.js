const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: false }, // optional for OTP
    email: { type: String, required: false, unique: true, sparse: true },
    phone: { type: String, required: false, unique: true, sparse: true },
    password: { type: String, required: false },
    isVerified: { type: Boolean, default: false }, // true after email OTP verification
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", UserSchema);