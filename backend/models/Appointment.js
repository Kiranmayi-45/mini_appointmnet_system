const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  consultant: { type: mongoose.Schema.Types.ObjectId, ref: "Consultant", required: true },

  date: String,
  startTime: String,
  endTime: String,

  status: {
    type: String,
    enum: ["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"],
    default: "PENDING",
  },

  otp: String,
  otpExpiresAt: Date,
});

module.exports = mongoose.model("Appointment", appointmentSchema);
