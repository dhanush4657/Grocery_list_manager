const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const {
  register,
  verifyEmailOtp,
  login,
  verifyLoginOtp,
  resendEmailOtp,
  sendOtp,
  verifyOtp,
  getMe,
  updateProfile,
} = require("../controllers/authController");

// ── Email / Password Auth ──────────────────────────────────────────────────
// Step 1: Register → sends verification OTP to email
router.post("/register", register);

// Step 2: Verify email OTP after registration → returns JWT
router.post("/verify-email", verifyEmailOtp);

// Step 1: Login with email+password → sends login OTP to email
router.post("/login", login);

// Step 2: Verify login OTP → returns JWT
router.post("/verify-login-otp", verifyLoginOtp);

// Resend OTP (for both verification & login flows)
// Body: { email, purpose: "verification" | "login" }
router.post("/resend-otp", resendEmailOtp);

// ── Phone OTP Auth (existing) ──────────────────────────────────────────────
router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);

// ── Protected Routes ───────────────────────────────────────────────────────
router.get("/me", auth, getMe);
router.put("/me", auth, updateProfile);

module.exports = router;