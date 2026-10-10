const router = require("express").Router();
const db = require("../config/db");
const { auth } = require("../middleware/auth");

router.get("/", async (req, res) => {
  try {
    const { q, cuisine, difficulty, maxTime, meal_type, diet } = req.query;
    let sql = `SELECT r.*, u.name AS author,
      COALESCE((SELECT AVG(rv.rating) FROM reviews rv WHERE rv.recipe_id=r.id),0) AS rating
      FROM recipes r JOIN users u ON u.id=r.user_id WHERE r.status='PUBLISHED'`;
    const params = [];
    if (q) {
      sql += ` AND (r.title LIKE ? OR r.title_ta LIKE ? OR r.description LIKE ? OR r.description_ta LIKE ?
        OR EXISTS (SELECT 1 FROM ingredients i WHERE i.recipe_id=r.id AND (i.name LIKE ? OR i.name_ta LIKE ?)))`;
      const s = `%${q}%`; params.push(s, s, s, s, s, s);
    }
    if (cuisine) { sql += " AND r.cuisine = ?"; params.push(cuisine); }
    if (difficulty) { sql += " AND r.difficulty = ?"; params.push(difficulty); }
    if (meal_type) { sql += " AND r.meal_type = ?"; params.push(meal_type); }
    if (diet) { sql += " AND r.dietary_tags LIKE ?"; params.push(`%${diet}%`); }
    if (maxTime) { sql += " AND (r.prep_minutes + r.cook_minutes) <= ?"; params.push(Number(maxTime)); }
    sql += " ORDER BY r.created_at DESC";
    const [rows] = await db.query(sql, params);
    res.json(rows);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get("/planner/recipes-with-ingredients", async (req, res) => {
  try {
    const [recipes] = await db.query(
      `SELECT r.id, r.title, r.title_ta, r.cuisine, r.meal_type, r.image_url, r.video_url, r.prep_minutes, r.cook_minutes
       FROM recipes r
       WHERE r.status = 'PUBLISHED'
       ORDER BY r.title ASC`
    );

    const [allIngs] = await db.query(
      `SELECT recipe_id, name, name_ta, quantity, unit, unit_ta FROM ingredients ORDER BY id ASC`
    );

    const ingsByRecipe = {};
    for (const item of allIngs) {
      if (!ingsByRecipe[item.recipe_id]) ingsByRecipe[item.recipe_id] = [];
      ingsByRecipe[item.recipe_id].push(item);
    }

    const result = recipes.map(r => ({
      ...r,
      ingredients: ingsByRecipe[r.id] || []
    }));

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/:id", async (req,res)=>{
  try{
    const [rows]=await db.query(`SELECT r.*,u.name AS author,
      COALESCE((SELECT AVG(rv.rating) FROM reviews rv WHERE rv.recipe_id=r.id),0) AS rating
      FROM recipes r JOIN users u ON u.id=r.user_id WHERE r.id=?`,[req.params.id]);
    if(!rows.length)return res.status(404).json({message:"Recipe not found"});
    const recipe=rows[0];
    const [ingredients]=await db.query("SELECT id,name,name_ta,quantity,unit,unit_ta FROM ingredients WHERE recipe_id=? ORDER BY id",[recipe.id]);
    const [steps]=await db.query("SELECT id,step_no,instruction,instruction_ta FROM recipe_steps WHERE recipe_id=? ORDER BY step_no",[recipe.id]);
    const [reviews]=await db.query(`SELECT rv.rating,rv.comment,rv.created_at,u.name FROM reviews rv JOIN users u ON u.id=rv.user_id WHERE rv.recipe_id=? ORDER BY rv.created_at DESC`,[recipe.id]);
    let videos = [];
    try {
      const [videoRows] = await db.query("SELECT id, title, video_url, video_id, channel_name, thumbnail_url, display_order FROM recipe_videos WHERE recipe_id=? ORDER BY display_order ASC", [recipe.id]);
      videos = videoRows || [];
    } catch (e) {
      videos = [];
    }
    res.json({...recipe,ingredients,steps,reviews,videos});
  }catch(err){res.status(500).json({message:err.message});}
});

router.post("/",auth,async(req,res)=>{
 const {title,title_ta,description,description_ta,cuisine,meal_type,difficulty,prep_minutes,cook_minutes,servings,image_url,video_url,subtitle_url,dietary_tags,ingredients,steps}=req.body;
 const connection=await db.getConnection();
 try{
  await connection.beginTransaction();
  const [result]=await connection.query(`INSERT INTO recipes
   (user_id,title,title_ta,description,description_ta,cuisine,meal_type,difficulty,prep_minutes,cook_minutes,servings,image_url,video_url,subtitle_url,dietary_tags)
   VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
   [req.user.id,title,title_ta||"",description,description_ta||"",cuisine,meal_type,difficulty,prep_minutes||0,cook_minutes||0,servings||1,image_url||"",video_url||"",subtitle_url||"",dietary_tags||""]);
  for(const item of ingredients||[]){
   if(!item.name && !item.name_ta)continue;
   await connection.query(`INSERT INTO ingredients(name,name_ta,quantity,unit,unit_ta,recipe_id) VALUES(?,?,?,?,?,?)`,
    [item.name||"",item.name_ta||"",item.quantity||"",item.unit||"",item.unit_ta||"",result.insertId]);
  }
  for(let i=0;i<(steps||[]).length;i++){
   const s=steps[i]; if(!s || (!s.instruction && !s.instruction_ta))continue;
   await connection.query(`INSERT INTO recipe_steps(recipe_id,step_no,instruction,instruction_ta) VALUES(?,?,?,?)`,
    [result.insertId,i+1,s.instruction||"",s.instruction_ta||""]);
  }
  await connection.commit();
  res.status(201).json({message:"Recipe published successfully",recipeId:result.insertId});
 }catch(err){await connection.rollback();res.status(500).json({message:err.message});}
 finally{connection.release();}
});
router.get("/:id/reviews", async (req, res) => {
  try {
    const [reviews] = await db.query(
      `SELECT rv.id, rv.rating, rv.comment, rv.created_at, u.name, u.profile_image
       FROM reviews rv
       JOIN users u ON u.id = rv.user_id
       WHERE rv.recipe_id = ?
       ORDER BY rv.created_at DESC`,
      [req.params.id]
    );

    const [stats] = await db.query(
      `SELECT COALESCE(AVG(rating), 5) as avgRating, COUNT(*) as totalReviews FROM reviews WHERE recipe_id = ?`,
      [req.params.id]
    );

    res.json({
      reviews,
      avgRating: Number(stats[0]?.avgRating || 5).toFixed(1),
      totalReviews: stats[0]?.totalReviews || 0
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/:id/reviews", async (req, res) => {
  try {
    const jwt = require("jsonwebtoken");
    const { rating, comment, name } = req.body;

    if (!comment || !String(comment).trim()) {
      return res.status(400).json({ message: "Review feedback comment is required" });
    }

    const numRating = Math.max(1, Math.min(5, Number(rating) || 5));
    let userId = null;
    let reviewerName = (name || "").trim() || "Food Enthusiast";

    // 1. Try to get authenticated user from Authorization header
    const authHeader = req.headers.authorization || "";
    if (authHeader.startsWith("Bearer ")) {
      try {
        const token = authHeader.substring(7);
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        userId = decoded.id;
        const [u] = await db.query("SELECT name FROM users WHERE id = ?", [userId]);
        if (u.length && u[0].name) reviewerName = u[0].name;
      } catch (e) {
        // Invalid or expired token, fall back to guest
      }
    }

    // 2. If no valid user token, attach to guest user or create guest user
    if (!userId) {
      const [existingGuest] = await db.query("SELECT id, name FROM users WHERE email = 'guest.foodie@cookshare.com'");
      if (existingGuest.length) {
        userId = existingGuest[0].id;
        if (name && name.trim()) {
          reviewerName = name.trim();
          // Optionally update guest name
          await db.query("UPDATE users SET name = ? WHERE id = ?", [reviewerName, userId]);
        }
      } else {
        const [newGuest] = await db.query(
          "INSERT INTO users (name, email, role, bio) VALUES (?, 'guest.foodie@cookshare.com', 'USER', 'Community Reviewer')",
          [reviewerName]
        );
        userId = newGuest.insertId;
      }
    }

    // 3. Save review
    await db.query(`
      INSERT INTO reviews (recipe_id, user_id, rating, comment)
      VALUES (?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE rating = VALUES(rating), comment = VALUES(comment), created_at = CURRENT_TIMESTAMP
    `, [req.params.id, userId, numRating, String(comment).trim()]);

    // 4. Compute updated rating stats
    const [stats] = await db.query(
      `SELECT COALESCE(AVG(rating), 5) as avgRating, COUNT(*) as totalReviews FROM reviews WHERE recipe_id = ?`,
      [req.params.id]
    );

    res.status(201).json({
      message: "Feedback submitted successfully!",
      review: {
        name: reviewerName,
        rating: numRating,
        comment: String(comment).trim(),
        created_at: new Date().toISOString()
      },
      avgRating: Number(stats[0]?.avgRating || 5).toFixed(1),
      totalReviews: stats[0]?.totalReviews || 0
    });
  } catch (err) {
    console.error("Review submission error:", err);
    res.status(500).json({ message: err.message });
  }
});

router.post("/:id/recent", auth, async(req,res)=>{
 try{await db.query(`INSERT INTO recently_accessed(user_id,recipe_id) VALUES(?,?) ON DUPLICATE KEY UPDATE accessed_at=CURRENT_TIMESTAMP`,[req.user.id,req.params.id]);res.json({message:"Recently accessed updated"});}
 catch(err){res.status(500).json({message:err.message});}
});

module.exports=router;
