const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const { search } = require("../controllers/searchController");

router.get("/", auth, search);

module.exports = router;
