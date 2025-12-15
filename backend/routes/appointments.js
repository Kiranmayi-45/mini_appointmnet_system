const router = require("express").Router();
const Appointment = require("../models/Appointment");
const { auth, isAdmin } = require("../middleware/auth");
const { generateOTP } = require("../utils/otp");
const { sendMail } = require("../utils/mailer");
const dayjs = require("dayjs");

// CREATE APPOINTMENT + SEND OTP
router.post("/", auth, async (req, res) => {
  try {
    const { consultantId, date, startTime, endTime } = req.body;

    const otp = generateOTP();
    const otpExpiresAt = dayjs().add(10, "minute").toDate();

    const appt = await Appointment.create({
      user: req.user.id,
      consultant: consultantId,
      date,
      startTime,
      endTime,
      otp,
      otpExpiresAt,
      status: "PENDING",
    });

    await sendMail(
      req.user.email,
      "OTP for Appointment Confirmation",
      `Your OTP is ${otp}. Valid for 10 minutes.`
    );

    res.json({
      appointmentId: appt._id,
      message: "OTP sent to email",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating appointment" });
  }
});

// VERIFY OTP
router.post("/verify-otp", auth, async (req, res) => {
  const { appointmentId, otp } = req.body;

  const appt = await Appointment.findById(appointmentId);
  if (!appt) return res.status(404).json({ message: "Appointment not found" });

  if (appt.otp !== otp || dayjs().isAfter(appt.otpExpiresAt)) {
    return res.status(400).json({ message: "Invalid or expired OTP" });
  }

  appt.status = "CONFIRMED";
  appt.otp = null;
  appt.otpExpiresAt = null;
  await appt.save();

  res.json({ message: "Appointment confirmed" });
});

// USER APPOINTMENTS
router.get("/me", auth, async (req, res) => {
  const list = await Appointment.find({ user: req.user.id })
    .populate("consultant");
  res.json(list);
});

// ADMIN ALL APPOINTMENTS
router.get("/", auth, isAdmin, async (req, res) => {
  const list = await Appointment.find()
    .populate("user", "name email")
    .populate("consultant", "name specialization");
  res.json(list);
});
// ADMIN → Update appointment status
router.post("/:id/status", auth, isAdmin, async (req, res) => {
  try {
    const { status } = req.body;

    const allowed = ["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"];
    if (!allowed.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const appt = await Appointment.findById(req.params.id);
    if (!appt) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    appt.status = status;
    await appt.save();

    res.json({ message: "Status updated successfully" });
  } catch (err) {
    console.error("❌ Status update error:", err);
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;
