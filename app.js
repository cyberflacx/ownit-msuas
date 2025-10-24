// ===== CORE IMPORTS =====
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const session = require("express-session");

const app = express();

// ===== EJS CONFIG =====
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json()); // 👈 add this line
app.use(bodyParser.urlencoded({ extended: true }));


// ===== SESSION CONFIG =====
app.use(
  session({
    secret: "ownit-msuas-secret",
    resave: false,
    saveUninitialized: false,
  })
);

// Make user available in all views if you want to show username in navbar
app.use((req, res, next) => {
  res.locals.currentUser = req.session.user || null;
  next();
});

// ===== ROUTES =====
const indexRoutes = require("./routes/index");
const wellnessRoutes = require("./routes/wellness");
const srhrRoutes = require("./routes/srhr");
const libraryRoutes = require("./routes/library");
const productivityRoutes = require("./routes/productivity");
const communityRoutes = require("./routes/community");
const authRoutes = require("./routes/auth"); // <— auth router with /login, /signup, /logout
const chatbotRoutes = require("./routes/chatbot");
// Only protect /productivity
function requireLogin(req, res, next) {
  if (!req.session.user) return res.redirect("/login");
  next();
}

// Public routes (unchanged behavior)
app.use("/", indexRoutes);
app.use("/wellness", wellnessRoutes);
app.use("/srhr", srhrRoutes);
app.use("/library", libraryRoutes);
app.use("/community", communityRoutes);
app.use("/chatbot", chatbotRoutes);

// Auth endpoints (mounted at root so /login works)
app.use("/", authRoutes);

// Protected routes
app.use("/productivity", requireLogin, productivityRoutes);

// ===== SERVER =====
const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`OwnIt.MSUAS running on http://localhost:${PORT}`)
);
