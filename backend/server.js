require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const passport = require("passport");

const { configureGoogleStrategy } = require("./config/passport");

const authRoutes = require("./routes/auth");
const recipeRoutes = require("./routes/recipes");
const userRoutes = require("./routes/users");
const adminRoutes = require("./routes/admin");
const aiRoutes = require("./routes/ai");
const glossaryRoutes = require("./routes/glossary");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

configureGoogleStrategy();

app.use(express.static(path.join(__dirname, "../frontend")));

app.use("/api/auth", authRoutes);
app.use("/api/recipes", recipeRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/glossary", glossaryRoutes);

app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    application: "CookShare",
    authentication: "JWT + Google OAuth"
  });
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`CookShare server running at http://localhost:${PORT}`);
});
