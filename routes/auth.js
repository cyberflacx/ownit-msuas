// routes/auth.js
const express = require("express");
const bcrypt = require("bcryptjs");
const router = express.Router();
const { readDB, writeDB } = require("../utils/db");

router.get("/login", (req, res) => {
  res.render("login", { title: "Login", error: null });
});

router.get("/signup", (req, res) => {
  res.render("signup", { title: "Sign Up", error: null });
});

router.post("/login", (req, res) => {
  const { username, password } = req.body;
  const db = readDB();
  const user = (db.users || []).find(u => u.username === username);

  if (!user) {
    return res.render("login", { title: "Login", error: "User not found." });
  }
  if (!bcrypt.compareSync(password, user.passwordHash)) {
    return res.render("login", { title: "Login", error: "Incorrect password." });
  }

  req.session.user = user.username;
  res.redirect("/productivity");
});

router.post("/signup", (req, res) => {
  const { username, password } = req.body;
  const db = readDB();
  db.users = db.users || [];

  if (db.users.find(u => u.username === username)) {
    return res.render("signup", { title: "Sign Up", error: "Username already exists." });
  }

  const hash = bcrypt.hashSync(password, 10);
  db.users.push({ username, passwordHash: hash });
  writeDB(db);

  req.session.user = username;
  res.redirect("/productivity");
});

router.get("/logout", (req, res) => {
  req.session.destroy(() => res.redirect("/login"));
});

module.exports = router;
