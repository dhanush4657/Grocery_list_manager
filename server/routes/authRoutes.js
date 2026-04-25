const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const { register, login, sendOtp, verifyOtp, getMe, updateProfile } = require("../controllers/authController");

router.post("/register", register);
router.post("/login", login);
router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
router.get("/me", auth, getMe);
router.put("/me", auth, updateProfile);

module.exports = router;
