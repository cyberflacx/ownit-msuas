// routes/community.js
const express = require("express");
const router = express.Router();
const { readDB, writeDB } = require("../utils/db");

// GET Community page
router.get("/", (req, res) => {
  const db = readDB();
  const posts = Array.isArray(db.posts) ? db.posts : [];
  res.render("community", { title: "Community", posts });
});

// POST new message
router.post("/post", (req, res) => {
  const db = readDB();
  const { message } = req.body;
  const user = req.session.user || "Guest";

  if (message && message.trim() !== "") {
    db.posts = db.posts || [];
    db.posts.push({
      text: message.trim(),
      user,
      date: new Date().toISOString(),
    });
    writeDB(db);
  }

  res.redirect("/community");
});

module.exports = router;
