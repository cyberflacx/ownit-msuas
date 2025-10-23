// routes/index.js
const express = require("express");
const router = express.Router();
const { readDB } = require("../utils/db");

router.get("/", (req, res) => {
  const db = readDB();

  // Always show the main dashboard (index.ejs)
  const currentUser = req.session.user || null;

  // Ensure arrays exist
  const moods = Array.isArray(db.moods) ? db.moods : [];
  const tasks = Array.isArray(db.tasks) ? db.tasks : [];
  const posts = Array.isArray(db.posts) ? db.posts : [];
  const resources = Array.isArray(db.resources) ? db.resources : [];

  // If logged in, show their data; if not, show global summary
  const userTasks = currentUser
    ? tasks.filter(t => t.username === currentUser)
    : tasks;

  const userMoods = currentUser
    ? moods.filter(m => m.username === currentUser)
    : moods;

  const moodCount = userMoods.length;
  const latestMood = userMoods.slice(-1)[0] || null;
  const taskCount = userTasks.length;
  const completedTasks = userTasks.filter(t => t && t.done).length;
  const resourceCount = resources.length;
  const postCount = posts.length;

  // Build last 10 mood points for chart
  const lastMoods = userMoods.slice(-10);
  const moodLabels = lastMoods.map(m => {
    try {
      return new Date(m.date).toLocaleDateString();
    } catch {
      return "";
    }
  });

  const moodValues = lastMoods.map(m => {
    switch (m.mood) {
      case "😊 Happy": return 5;
      case "😐 Okay": return 4;
      case "😴 Tired": return 3;
      case "😞 Sad": return 2;
      case "😤 Stressed": return 1;
      default: return 0;
    }
  });

  res.render("index", {
    title: "OwnIt.MSUAS | Dashboard",
    user: currentUser,
    moodCount,
    latestMood,
    taskCount,
    completedTasks,
    resourceCount,
    postCount,
    moodLabels: JSON.stringify(moodLabels),
    moodValues: JSON.stringify(moodValues),
  });
});

module.exports = router;
