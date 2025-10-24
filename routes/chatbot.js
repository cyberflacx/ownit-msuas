const express = require("express");
const router = express.Router();

router.post("/", (req, res) => {
  const message = (req.body.message || "").toLowerCase(); // ✅ Prevent undefined error
  let reply = "I'm not sure I understand that. Try asking about MSUAS, wellness, SRHR, or library.";

  // Basic responses
  if (message.includes("hello") || message.includes("hi"))
    reply = "👋 Hello! I’m the OwnIt.MSUAS Assistant. How can I help you today?";
  else if (message.includes("msuas"))
    reply = "🏛️ MSUAS stands for Manicaland State University of Applied Sciences — where innovation meets impact.";
  else if (message.includes("mental") || message.includes("stress"))
    reply = "💆 Take a deep breath. You can explore the 'Wellness Zone' for self-care and mental support resources.";
  else if (message.includes("library") || message.includes("study"))
    reply = "📚 You can find open learning materials in the 'Open Library' section.";
  else if (message.includes("srhr") || message.includes("health"))
    reply = "❤️ SRHR stands for Sexual and Reproductive Health and Rights. We promote safe and informed health awareness.";
  else if (message.includes("productivity") || message.includes("planner"))
    reply = "⏰ Try our Productivity Toolkit to manage time, tasks, and assignments efficiently.";
  else if (message.includes("thank"))
    reply = "😊 You’re welcome! Happy to assist anytime.";

  res.json({ reply });
});

module.exports = router;
