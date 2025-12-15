// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");
// require("dotenv").config();

// const app = express();

// app.use(cors());
// app.use(express.json());

// console.log("🚀 Starting server...");

// // temp test route
// app.get("/", (req, res) => {
//   res.send("Backend working");
// });

// // routes
// app.use("/api/auth", require("./routes/auth"));
// app.use("/api/consultants", require("./routes/consultants"));
// app.use("/api/appointments", require("./routes/appointments"));

// mongoose
//   .connect(process.env.MONGO_URI)
//   .then(() => {
//     console.log("✅ MongoDB Atlas Connected");

//     app.listen(process.env.PORT || 4000, () => {
//       console.log(
//         "✅ Server running on port",
//         process.env.PORT || 4000
//       );
//     });
//   })
//   .catch((err) => {
//     console.error("❌ MongoDB connection error:");
//     console.error(err);
//     process.exit(1);
//   });

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
require("./cron/reminderJob");
// require("./cron/reminderJob");

const app = express();
// backend/server.js
// const cors = require('cors');


// ✅ ADD THESE TWO LINES
app.use(cors({
  origin: "*",
  credentials: true
}));

app.use(express.json());

// ROUTES
const authRoutes = require("./routes/auth");
const consultantRoutes = require("./routes/consultants");
const appointmentRoutes = require("./routes/appointments");

app.use("/api/auth", authRoutes);
app.use("/api/consultants", consultantRoutes);
app.use("/api/appointments", appointmentRoutes);

// START
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(4000, () => console.log("Server running on 4000"));
  })
  .catch((err) => console.log(err));
