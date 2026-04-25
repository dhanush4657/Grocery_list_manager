const mongoose = require("mongoose");

const ActivitySchema = new mongoose.Schema(
  {
    groupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    action: {
      type: String,
      required: true,
    },
    details: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      default: "info", // "success", "warning", "info"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Activity", ActivitySchema);
