const mongoose = require("mongoose");

const OtpSchema = new mongoose.Schema(
  {
    // Either phone or email will be present depending on flow
    phone: { type: String, required: false },
    email: { type: String, required: false },
    otp: { type: String, required: true },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

// TTL index to automatically delete expired OTPs from MongoDB
OtpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model("Otp", OtpSchema);