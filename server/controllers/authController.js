const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Otp = require("../models/Otp");
const { sendOtpEmail } = require("../services/emailService");

// ─── Helper: generate signed JWT ────────────────────────────────────────────
const signToken = (userId) =>
  new Promise((resolve, reject) => {
    const payload = { user: { id: userId } };
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" }, (err, token) => {
      if (err) reject(err);
      else resolve(token);
    });
  });

// ─── Helper: generate & store OTP ───────────────────────────────────────────
const generateOtp = async (filterKey, filterValue) => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 5 * 60000); // 5 minutes

  await Otp.findOneAndUpdate(
    { [filterKey]: filterValue },
    { [filterKey]: filterValue, otp, expiresAt },
    { upsert: true, new: true }
  );

  return otp;
};

// ────────────────────────────────────────────────────────────────────────────
// REGISTER — creates account and sends verification OTP to email
// POST /api/auth/register
// Body: { name, email, password }
// ────────────────────────────────────────────────────────────────────────────
exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user && user.isVerified) {
      return res.status(400).json({ msg: "User already exists" });
    }

    // If user exists but never verified, allow re-registration (resend OTP)
    if (!user) {
      user = new User({ name, email, password });
    } else {
      user.name = name;
      user.password = password;
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    user.isVerified = false;
    await user.save();

    // Send email verification OTP
    const otp = await generateOtp("email", email);
    await sendOtpEmail(email, otp, "verification");

    res.json({ msg: "Registration successful. Please check your email for the OTP to verify your account." });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

// ────────────────────────────────────────────────────────────────────────────
// VERIFY EMAIL OTP — verifies account after registration
// POST /api/auth/verify-email
// Body: { email, otp }
// ────────────────────────────────────────────────────────────────────────────
exports.verifyEmailOtp = async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    return res.status(400).json({ msg: "Email and OTP are required" });
  }

  try {
    const otpRecord = await Otp.findOne({ email, otp });
    if (!otpRecord) {
      return res.status(400).json({ msg: "Invalid or expired OTP" });
    }

    // Check manual expiry (belt-and-suspenders over the TTL index)
    if (otpRecord.expiresAt < new Date()) {
      await Otp.deleteOne({ _id: otpRecord._id });
      return res.status(400).json({ msg: "OTP has expired. Please request a new one." });
    }

    await Otp.deleteOne({ _id: otpRecord._id });

    const user = await User.findOneAndUpdate(
      { email },
      { isVerified: true },
      { new: true }
    );
    if (!user) return res.status(404).json({ msg: "User not found" });

    const token = await signToken(user.id);
    res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

// ────────────────────────────────────────────────────────────────────────────
// LOGIN — sends OTP to email instead of returning token directly
// POST /api/auth/login
// Body: { email, password }
// ────────────────────────────────────────────────────────────────────────────
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Invalid Credentials" });

    if (!user.isVerified) {
      return res.status(403).json({ msg: "Please verify your email before logging in." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid Credentials" });

    // Send login OTP — user completes login via /verify-login-otp
    const otp = await generateOtp("email", email);
    await sendOtpEmail(email, otp, "login");

    res.json({ msg: "OTP sent to your email. Please verify to complete login." });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

// ────────────────────────────────────────────────────────────────────────────
// VERIFY LOGIN OTP — second step of login, returns JWT on success
// POST /api/auth/verify-login-otp
// Body: { email, otp }
// ────────────────────────────────────────────────────────────────────────────
exports.verifyLoginOtp = async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    return res.status(400).json({ msg: "Email and OTP are required" });
  }

  try {
    const otpRecord = await Otp.findOne({ email, otp });
    if (!otpRecord) {
      return res.status(400).json({ msg: "Invalid or expired OTP" });
    }

    if (otpRecord.expiresAt < new Date()) {
      await Otp.deleteOne({ _id: otpRecord._id });
      return res.status(400).json({ msg: "OTP has expired. Please login again." });
    }

    await Otp.deleteOne({ _id: otpRecord._id });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ msg: "User not found" });

    const token = await signToken(user.id);
    res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

// ────────────────────────────────────────────────────────────────────────────
// RESEND EMAIL OTP — for both registration verification and login
// POST /api/auth/resend-otp
// Body: { email, purpose }  purpose: "verification" | "login"
// ────────────────────────────────────────────────────────────────────────────
exports.resendEmailOtp = async (req, res) => {
  const { email, purpose } = req.body;
  if (!email) return res.status(400).json({ msg: "Email is required" });

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ msg: "No account found with this email" });

    if (purpose === "verification" && user.isVerified) {
      return res.status(400).json({ msg: "Email is already verified" });
    }

    const otp = await generateOtp("email", email);
    await sendOtpEmail(email, otp, purpose || "verification");

    res.json({ msg: "OTP resent successfully. Please check your email." });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

// ────────────────────────────────────────────────────────────────────────────
// PHONE OTP (existing flow — unchanged)
// ────────────────────────────────────────────────────────────────────────────
exports.sendOtp = async (req, res) => {
  const { phone } = req.body;
  if (!phone) return res.status(400).json({ msg: "Phone number is required" });

  try {
    const otp = await generateOtp("phone", phone);

    // Replace this block with a real SMS provider (Twilio, MSG91, etc.)
    console.log(`\n================================`);
    console.log(`📱 SMS TO: ${phone}`);
    console.log(`🔐 OTP: ${otp}`);
    console.log(`================================\n`);

    res.json({ msg: "OTP sent successfully (check backend console)" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

exports.verifyOtp = async (req, res) => {
  const { phone, otp } = req.body;
  if (!phone || !otp) return res.status(400).json({ msg: "Phone and OTP are required" });

  try {
    const otpRecord = await Otp.findOne({ phone, otp });
    if (!otpRecord) return res.status(400).json({ msg: "Invalid or expired OTP" });

    if (otpRecord.expiresAt < new Date()) {
      await Otp.deleteOne({ _id: otpRecord._id });
      return res.status(400).json({ msg: "OTP has expired" });
    }

    await Otp.deleteOne({ _id: otpRecord._id });

    let user = await User.findOne({ phone });
    if (!user) {
      user = new User({ phone, isVerified: true });
      await user.save();
    }

    const token = await signToken(user.id);
    res.json({ token, user: { id: user.id, name: user.name || "User" } });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

// ────────────────────────────────────────────────────────────────────────────
// GET ME / UPDATE PROFILE (unchanged)
// ────────────────────────────────────────────────────────────────────────────
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ msg: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).send("Server error");
  }
};

exports.updateProfile = async (req, res) => {
  const { name, phone } = req.body;
  try {
    let user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ msg: "User not found" });

    if (name) user.name = name;
    if (phone) user.phone = phone;

    await user.save();
    res.json(user);
  } catch (err) {
    res.status(500).send("Server error");
  }
};