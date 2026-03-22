const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
app.disable("etag");  

// ✅ Middleware FIRST
app.use(
  cors({
    origin: "*", // allow all (quick fix)
  })
);
app.use(express.json());

// ✅ Routes AFTER middleware
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);

// test route
app.get("/", (req, res) => {
  res.send("API Running 🚀");
});

// DB connect
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

app.listen(5000, () => {
  console.log("Server running on port 5000");
});