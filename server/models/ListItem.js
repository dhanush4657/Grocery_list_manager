const mongoose = require("mongoose");

const ItemSchema = new mongoose.Schema(
  {
    listId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "List",
      required: true,
    }, // Ties item to a group list [cite: 49]
    name: { type: String, required: true },
    quantity: { type: Number, default: 1 },
    category: { type: String, default: "General" }, // Supports categorization (Vegetables, Dairy, etc.) [cite: 32]
    isPurchased: { type: Boolean, default: false }, // For purchase tracking [cite: 49]
    addedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Item", ItemSchema);
