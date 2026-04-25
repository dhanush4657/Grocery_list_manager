const mongoose = require("mongoose");

const ActivityLogSchema = new mongoose.Schema(
  {
    action: { type: String, required: true }, // e.g. "Created list", "Joined workspace", "Completed item"
    details: { type: String }, // e.g. "Weekly Groceries"
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    groupId: { type: mongoose.Schema.Types.ObjectId, ref: "Group" }, // Optional, can be global
    type: { type: String, enum: ['info', 'success', 'warning', 'error'], default: 'info' } // To map colors in UI
  },
  { timestamps: true },
);

module.exports = mongoose.model("ActivityLog", ActivityLogSchema);
