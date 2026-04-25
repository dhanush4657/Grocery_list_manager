const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const {
  addItem,
  getItems,
  toggleItem,
  updateItem,
} = require("../controllers/itemController");

router.post("/", auth, addItem);
router.get("/:listId", auth, getItems);
router.put("/:id/toggle", auth, toggleItem);
router.put("/:id", auth, updateItem);

module.exports = router;
