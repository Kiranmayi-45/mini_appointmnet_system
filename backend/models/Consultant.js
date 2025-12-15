const mongoose = require("mongoose");

const consultantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  specialization: { type: String, required: true },
});

module.exports = mongoose.model("Consultant", consultantSchema);
