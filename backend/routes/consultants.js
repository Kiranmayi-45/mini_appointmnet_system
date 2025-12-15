const router = require("express").Router();
const Consultant = require("../models/Consultant");
const { auth, isAdmin } = require("../middleware/auth");

// ADMIN create consultant
router.post("/", auth, isAdmin, async (req, res) => {
  try {
    const consultant = await Consultant.create(req.body);
    res.json(consultant);
  } catch (error) {
    res.status(500).json({ message: "Error creating consultant" });
  }
});

// GET all consultants
router.get("/", async (req, res) => {
  try {
    const consultants = await Consultant.find();
    res.json(consultants);
  } catch (err) {
    res.status(500).json({ message: "Error fetching consultants" });
  }
});

module.exports = router;
