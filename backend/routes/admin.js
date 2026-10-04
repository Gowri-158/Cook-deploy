const router = require("express").Router();
const db = require("../config/db");
const { auth, adminOnly } = require("../middleware/auth");

router.use(auth, adminOnly);

router.get("/dashboard", async (req, res) => {
  const [[users]] = await db.query("SELECT COUNT(*) AS total FROM users");
  const [[recipes]] = await db.query("SELECT COUNT(*) AS total FROM recipes");
  const [[reviews]] = await db.query("SELECT COUNT(*) AS total FROM reviews");
  const [[recent]] = await db.query(`
    SELECT COUNT(*) AS total FROM recently_accessed
    WHERE accessed_at >= NOW() - INTERVAL 7 DAY
  `);

  res.json({
    users: users.total,
    recipes: recipes.total,
    reviews: reviews.total,
    recentAccesses: recent.total
  });
});

router.get("/users", async (req, res) => {
  const [rows] = await db.query(`
    SELECT id,name,email,role,created_at
    FROM users ORDER BY created_at DESC
  `);
  res.json(rows);
});

router.get("/recipes", async (req, res) => {
  const [rows] = await db.query(`
    SELECT r.id,r.title,r.status,r.created_at,u.name AS author
    FROM recipes r JOIN users u ON u.id=r.user_id
    ORDER BY r.created_at DESC
  `);
  res.json(rows);
});

router.patch("/recipes/:id/status", async (req, res) => {
  await db.query(
    "UPDATE recipes SET status=? WHERE id=?",
    [req.body.status, req.params.id]
  );

  res.json({ message: "Recipe status updated" });
});

module.exports = router;
