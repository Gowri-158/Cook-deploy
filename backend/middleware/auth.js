const jwt = require("jsonwebtoken");

function auth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.substring(7) : null;

  if (!token) {
    return res.status(401).json({ message: "Authentication required" });
  }

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      try {
        req.user = jwt.verify(token, process.env.JWT_SECRET, { ignoreExpiration: true });
        return next();
      } catch {
        return res.status(401).json({ message: "Invalid or expired JWT" });
      }
    }
    return res.status(401).json({ message: "Invalid or expired JWT" });
  }
}

function adminOnly(req, res, next) {
  if (req.user?.role !== "ADMIN") {
    return res.status(403).json({ message: "ADMIN role required" });
  }
  next();
}

module.exports = { auth, adminOnly };
