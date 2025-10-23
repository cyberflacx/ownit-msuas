// routes/productivity.js
const express = require("express");
const router = express.Router();
const { readDB, writeDB } = require("../utils/db");

function requireLogin(req, res, next) {
  if (!req.session.user) return res.redirect("/login");
  next();
}

// ===== GET /productivity =====
router.get("/", requireLogin, (req, res) => {
  const db = readDB();
  const currentUser = req.session.user;
  db.tasks = db.tasks || [];
  const userTasks = db.tasks.filter(t => t.username === currentUser);
  const completedTasks = userTasks.filter(t => t.done).length;

  res.render("productivity", {
    title: "Productivity Toolkit",
    tasks: userTasks,
    completedTasks,
    user: currentUser,
  });
});

// ===== POST /productivity/add =====
router.post("/add", requireLogin, (req, res) => {
  const db = readDB();
  const { task, due } = req.body;
  const currentUser = req.session.user;

  if (task) {
    db.tasks = db.tasks || [];
    db.tasks.push({
      username: currentUser,
      task: task.trim(),
      done: false,
      due: due || null,
      created: new Date().toISOString(),
    });
    writeDB(db);
  }
  res.redirect("/productivity");
});

// ===== POST /productivity/markdone =====
router.post("/markdone", requireLogin, (req, res) => {
  const db = readDB();
  const currentUser = req.session.user;
  const index = parseInt(req.body.index);
  const userTasks = db.tasks.filter(t => t.username === currentUser);
  const task = userTasks[index];
  if (task) {
    const globalIndex = db.tasks.findIndex(
      t => t.username === currentUser && t.task === task.task
    );
    if (globalIndex !== -1) {
      db.tasks[globalIndex].done = true;
      writeDB(db);
    }
  }
  res.redirect("/productivity");
});

// ===== POST /productivity/delete =====
router.post("/delete", requireLogin, (req, res) => {
  const db = readDB();
  const currentUser = req.session.user;
  const index = parseInt(req.body.index);

  const userTasks = db.tasks.filter(t => t.username === currentUser);
  const task = userTasks[index];

  if (task) {
    db.tasks = db.tasks.filter(
      t => !(t.username === currentUser && t.task === task.task)
    );
    writeDB(db);
  }
  res.redirect("/productivity");
});

module.exports = router;
