const express = require("express");
const router = express.Router();
const { readDB, writeDB } = require("../utils/db");

router.get("/", (req, res) => {
  const db = readDB();
  const latestMood = db.moods.slice(-1)[0];
  res.render("wellness", { title: "Mental Wellness Zone", mood: latestMood });
});

router.post("/mood", (req, res) => {
  const db = readDB();
  const { mood } = req.body;
  db.moods.push({ mood, date: new Date().toISOString() });
  writeDB(db);
  res.redirect("/wellness");
});

module.exports = router;
