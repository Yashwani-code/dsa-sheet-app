const express = require("express");
const router = express.Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");

// middleware
const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return res.status(401).json("No token");

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.userId = decoded.id;

  next();
};

// GET progress
router.get("/progress", auth, async (req, res) => {
  const user = await User.findById(req.userId);
  res.json(user.completedProblems);
});

// UPDATE progress
router.post("/progress", auth, async (req, res) => {
  const { problemId } = req.body;

  const user = await User.findById(req.userId);

  const index = user.completedProblems.indexOf(problemId);

  if (index === -1) {
    // ✅ ADD
    user.completedProblems.push(problemId);
  } else {
    // ✅ REMOVE (UN-CHECK)
    user.completedProblems.splice(index, 1);
  }

  await user.save();

  res.json(user.completedProblems);
});
module.exports = router;