const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const {
  createList,
  getListsByGroup,
  updateList,
  deleteList,
} = require("../controllers/listController");

router.post("/", auth, createList);
router.get("/group/:groupId", auth, getListsByGroup);
router.put("/:id", auth, updateList);
router.delete("/:id", auth, deleteList);

module.exports = router;
