const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const db = require("./db");

function configureGoogleStrategy() {
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    console.log("Google OAuth is not configured. Add credentials to .env to enable it.");
    return;
  }

  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      const email = profile.emails?.[0]?.value;
      if (!email) return done(new Error("Google account has no email"));

      const [existing] = await db.query(
        "SELECT * FROM users WHERE email = ?",
        [email]
      );

      if (existing.length) return done(null, existing[0]);

      const [result] = await db.query(
        `INSERT INTO users
         (name, email, oauth_provider, oauth_id, role)
         VALUES (?, ?, 'google', ?, 'USER')`,
        [profile.displayName || "CookShare User", email, profile.id]
      );

      const [created] = await db.query(
        "SELECT * FROM users WHERE id = ?",
        [result.insertId]
      );

      done(null, created[0]);
    } catch (err) {
      done(err);
    }
  }));
}

module.exports = { configureGoogleStrategy };
