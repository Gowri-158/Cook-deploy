const router = require("express").Router();
const db = require("../config/db");
const { auth } = require("../middleware/auth");

router.get("/me/recent", auth, async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT r.id, r.title, r.title_ta, r.cuisine, r.difficulty, r.image_url, ra.accessed_at
      FROM recently_accessed ra
      JOIN recipes r ON r.id = ra.recipe_id
      WHERE ra.user_id = ?
      ORDER BY ra.accessed_at DESC
      LIMIT 10
    `, [req.user.id]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/me/recent/:recipeId", auth, async (req, res) => {
  try {
    await db.query(`
      INSERT INTO recently_accessed (user_id, recipe_id, accessed_at)
      VALUES (?, ?, NOW())
      ON DUPLICATE KEY UPDATE accessed_at = NOW()
    `, [req.user.id, req.params.recipeId]);

    res.json({ message: "Recently accessed recorded" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/me/favorites", auth, async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT r.*
      FROM favorites f
      JOIN recipes r ON r.id=f.recipe_id
      WHERE f.user_id=?
      ORDER BY f.created_at DESC
    `, [req.user.id]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/me/favorites/:recipeId", auth, async (req, res) => {
  try {
    await db.query(
      "INSERT IGNORE INTO favorites(user_id,recipe_id) VALUES(?,?)",
      [req.user.id, req.params.recipeId]
    );
    res.json({ message: "Recipe saved" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete("/me/favorites/:recipeId", auth, async (req, res) => {
  try {
    await db.query(
      "DELETE FROM favorites WHERE user_id=? AND recipe_id=?",
      [req.user.id, req.params.recipeId]
    );
    res.json({ message: "Recipe removed from favorites" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/me/shopping-list", auth, async (req, res) => {
  try {
    const { dish } = req.query;

    // 1. Auto-deduplicate any existing duplicates in user's shopping list
    try {
      await db.query(`
        DELETE FROM shopping_items
        WHERE id NOT IN (
          SELECT MIN(id) FROM shopping_items
          WHERE user_id=?
          GROUP BY LOWER(name), LOWER(COALESCE(NULLIF(dish_name, ''), category, ''))
        ) AND user_id=?
      `, [req.user.id, req.user.id]);
    } catch (e) {}

    // 2. Fetch items (optionally filtered by specific dish)
    let query = `
      SELECT id, user_id, name, quantity, unit, category,
             COALESCE(NULLIF(dish_name, ''), category, 'General') AS dish_name,
             purchased, created_at
      FROM shopping_items
      WHERE user_id=?
    `;
    const params = [req.user.id];

    if (dish && dish !== "all" && dish !== "All Dishes") {
      query += ` AND (LOWER(dish_name) = LOWER(?) OR (dish_name = '' AND LOWER(category) = LOWER(?)))`;
      params.push(dish, dish);
    }

    query += ` ORDER BY purchased, COALESCE(NULLIF(dish_name, ''), category), name`;

    const [rows] = await db.query(query, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/me/shopping-list", auth, async (req, res) => {
  try {
    const { name, quantity, unit, category, dish_name } = req.body;
    if (!name || !String(name).trim()) {
      return res.status(400).json({ message: "Ingredient name is required" });
    }

    const cleanName = String(name).trim();
    const cleanDish = String(dish_name || category || "General").trim();
    const cleanCat = String(category || "Other").trim();

    // Check if item already exists for this user and dish -> update instead of duplicate
    const [existing] = await db.query(`
      SELECT id FROM shopping_items
      WHERE user_id=? AND LOWER(name)=LOWER(?) AND (LOWER(dish_name)=LOWER(?) OR LOWER(category)=LOWER(?))
    `, [req.user.id, cleanName, cleanDish, cleanDish]);

    if (existing.length > 0) {
      if (quantity && String(quantity).trim()) {
        await db.query(`
          UPDATE shopping_items SET quantity=?, unit=? WHERE id=?
        `, [String(quantity).trim(), String(unit || "").trim(), existing[0].id]);
      }
      return res.status(200).json({ message: "Ingredient updated", id: existing[0].id });
    }

    const [result] = await db.query(`
      INSERT INTO shopping_items
      (user_id, name, quantity, unit, category, dish_name)
      VALUES(?, ?, ?, ?, ?, ?)
    `, [
      req.user.id, cleanName, String(quantity || "").trim(), String(unit || "").trim(),
      cleanCat, cleanDish
    ]);

    res.status(201).json({ message: "Ingredient added", id: result.insertId });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/me/shopping-list/batch", auth, async (req, res) => {
  try {
    const { items, dish_name, replace_dish } = req.body;
    if (!Array.isArray(items) || !items.length) {
      return res.status(400).json({ message: "Items array is required" });
    }

    const batchDish = String(dish_name || "").trim();

    // If replace_dish is true, clear old items for this specific dish first so user gets ONLY this dish's menu!
    if (replace_dish && batchDish) {
      await db.query(`
        DELETE FROM shopping_items
        WHERE user_id=? AND (LOWER(dish_name)=LOWER(?) OR LOWER(category)=LOWER(?))
      `, [req.user.id, batchDish, batchDish]);
    }

    let addedCount = 0;
    for (const item of items) {
      if (!item.name || !String(item.name).trim()) continue;
      const cleanName = String(item.name).trim();
      const itemDish = String(item.dish_name || batchDish || item.category || "General").trim();
      const itemCat = String(item.category || "Grocery").trim();

      // Check if duplicate already exists for this dish
      const [existing] = await db.query(`
        SELECT id FROM shopping_items
        WHERE user_id=? AND LOWER(name)=LOWER(?) AND (LOWER(dish_name)=LOWER(?) OR LOWER(category)=LOWER(?))
      `, [req.user.id, cleanName, itemDish, itemDish]);

      if (existing.length > 0) {
        if (item.quantity && String(item.quantity).trim()) {
          await db.query(`
            UPDATE shopping_items SET quantity=?, unit=? WHERE id=?
          `, [String(item.quantity).trim(), String(item.unit || "").trim(), existing[0].id]);
        }
        continue;
      }

      await db.query(`
        INSERT INTO shopping_items (user_id, name, quantity, unit, category, dish_name)
        VALUES (?, ?, ?, ?, ?, ?)
      `, [
        req.user.id,
        cleanName,
        String(item.quantity || "").trim(),
        String(item.unit || "").trim(),
        itemCat,
        itemDish
      ]);
      addedCount++;
    }

    res.status(201).json({ message: `${addedCount} items added to shopping list` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.patch("/me/shopping-list/:id", auth, async (req, res) => {
  try {
    await db.query(`
      UPDATE shopping_items SET purchased=?
      WHERE id=? AND user_id=?
    `, [Boolean(req.body.purchased), req.params.id, req.user.id]);

    res.json({ message: "Shopping item updated" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete single item by ID
router.delete("/me/shopping-list/:id", auth, async (req, res) => {
  try {
    await db.query(
      "DELETE FROM shopping_items WHERE id=? AND user_id=?",
      [req.params.id, req.user.id]
    );

    res.json({ message: "Shopping item deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Bulk clear: either all items, or items of a specific dish
router.delete("/me/shopping-list", auth, async (req, res) => {
  try {
    const { dish } = req.query;
    if (dish && dish !== "all" && dish !== "All Dishes") {
      await db.query(`
        DELETE FROM shopping_items
        WHERE user_id=? AND (LOWER(dish_name)=LOWER(?) OR LOWER(category)=LOWER(?))
      `, [req.user.id, dish, dish]);
      return res.json({ message: `Cleared items for "${dish}"` });
    }

    await db.query("DELETE FROM shopping_items WHERE user_id=?", [req.user.id]);
    res.json({ message: "All shopping list items cleared" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Sync active meal plan ingredients directly into user's shopping list
router.post("/me/meal-plan/sync-to-shopping", auth, async (req, res) => {
  try {
    const { plan, replace = true, excluded = [], customItems = [], items = [] } = req.body;

    // 1. If replace is true, clear old shopping items so user gets ONLY the meal plan!
    if (replace) {
      await db.query("DELETE FROM shopping_items WHERE user_id=?", [req.user.id]);
    }

    // If pre-compiled items are provided, insert them directly
    if (Array.isArray(items) && items.length > 0) {
      let count = 0;
      for (const it of items) {
        if (!it.name || !String(it.name).trim()) continue;
        await db.query(`
          INSERT INTO shopping_items (user_id, name, quantity, unit, category, dish_name)
          VALUES (?, ?, ?, ?, ?, ?)
        `, [
          req.user.id,
          String(it.name).trim(),
          String(it.quantity || "").trim(),
          String(it.unit || "").trim(),
          String(it.category || "📅 Weekly Meal Plan").trim(),
          "📅 Weekly Meal Plan"
        ]);
        count++;
      }
      return res.json({ message: `Successfully synced ${count} ingredients from Weekly Meal Plan!`, count });
    }

    // Otherwise compile from plan object { "Monday_Lunch": 1, ... }
    let recipeIds = [];
    if (plan && typeof plan === "object") {
      recipeIds = Object.values(plan).map(Number).filter(id => id > 0);
    }

    if (!recipeIds.length && (!customItems || !customItems.length)) {
      return res.status(400).json({ message: "No meals planned to sync" });
    }

    let addedCount = 0;
    const excludedNorm = (excluded || []).map(e => String(e).toLowerCase().trim());
    const aggregated = {}; // name -> { name, quantity, unit, category }

    if (recipeIds.length > 0) {
      const placeholders = recipeIds.map(() => "?").join(",");
      const [allIngs] = await db.query(
        `SELECT recipe_id, name, name_ta, quantity, unit FROM ingredients WHERE recipe_id IN (${placeholders})`,
        recipeIds
      );

      for (const ing of allIngs) {
        const normKey = String(ing.name).toLowerCase().trim();
        if (!normKey || excludedNorm.includes(normKey)) continue;

        if (!aggregated[normKey]) {
          aggregated[normKey] = {
            name: ing.name,
            quantity: ing.quantity || "",
            unit: ing.unit || "",
            category: "📅 Weekly Meal Plan"
          };
        } else {
          // Sum quantities if numbers
          const n1 = parseFloat(aggregated[normKey].quantity);
          const n2 = parseFloat(ing.quantity);
          if (!isNaN(n1) && !isNaN(n2)) {
            aggregated[normKey].quantity = (n1 + n2).toString();
          }
        }
      }
    }

    // Fold in custom items
    for (const c of customItems) {
      const normKey = String(c.name).toLowerCase().trim();
      if (!normKey || excludedNorm.includes(normKey)) continue;
      if (!aggregated[normKey]) {
        aggregated[normKey] = {
          name: c.name,
          quantity: c.quantity || "",
          unit: c.unit || "",
          category: c.category || "📅 Weekly Meal Plan"
        };
      }
    }

    // Insert all compiled items into shopping list
    for (const key of Object.keys(aggregated)) {
      const it = aggregated[key];
      await db.query(`
        INSERT INTO shopping_items (user_id, name, quantity, unit, category, dish_name)
        VALUES (?, ?, ?, ?, ?, ?)
      `, [
        req.user.id,
        it.name,
        it.quantity,
        it.unit,
        it.category,
        "📅 Weekly Meal Plan"
      ]);
      addedCount++;
    }

    res.json({
      message: `Successfully set shopping list to ${addedCount} ingredients from your Meal Plan!`,
      count: addedCount
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

