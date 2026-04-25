const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const { createGroup, getGroups, joinGroup, getDashboardStats, deleteGroup } = require("../controllers/groupController");

router.post("/", auth, createGroup);
router.get("/", auth, getGroups);
router.post("/join", auth, joinGroup);
router.get("/stats", auth, getDashboardStats);
router.delete("/:id", auth, deleteGroup);

module.exports = router;
