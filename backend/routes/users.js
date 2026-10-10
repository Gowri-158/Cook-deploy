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

router.get("/me/shopping-list/whatsapp-text", auth, async (req, res) => {
  try {
    const { dish, pendingOnly } = req.query;
    let query = `
      SELECT id, name, quantity, unit, category,
             COALESCE(NULLIF(dish_name, ''), category, 'General') AS dish_name,
             purchased
      FROM shopping_items
      WHERE user_id=?
    `;
    const params = [req.user.id];

    if (dish && dish !== "all" && dish !== "All Dishes") {
      query += ` AND (LOWER(dish_name) = LOWER(?) OR (dish_name = '' AND LOWER(category) = LOWER(?)))`;
      params.push(dish, dish);
    }

    if (pendingOnly === "true" || pendingOnly === "1") {
      query += ` AND purchased=0`;
    }

    query += ` ORDER BY COALESCE(NULLIF(dish_name, ''), category), name`;
    const [rows] = await db.query(query, params);

    const today = new Date().toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });

    let header = `🛒 *CookShare - Grocery & Shopping List*\n📅 Date: ${today}\n━━━━━━━━━━━━━━━━━━━━\n\n`;
    if (dish && dish !== "all" && dish !== "All Dishes") {
      header = `🛒 *CookShare - ${dish} Ingredients*\n📅 Date: ${today}\n━━━━━━━━━━━━━━━━━━━━\n\n`;
    }

    const groups = {};
    for (const r of rows) {
      const g = r.dish_name || "General";
      if (!groups[g]) groups[g] = [];
      groups[g].push(r);
    }

    let text = header;
    for (const g of Object.keys(groups)) {
      text += `🍽 *${g}* (${groups[g].length})\n`;
      for (const item of groups[g]) {
        const check = item.purchased ? "☑" : "◻";
        const qtyStr = (item.quantity && item.unit) ? ` - ${item.quantity} ${item.unit}` : (item.quantity ? ` - ${item.quantity}` : "");
        text += `  ${check} ${item.name}${qtyStr}\n`;
      }
      text += `\n`;
    }

    text += `━━━━━━━━━━━━━━━━━━━━\n`;
    text += `📊 *Total Items:* ${rows.length}\n`;
    text += `✨ _Shared via CookShare Culinary Platform_`;

    res.json({ text, count: rows.length, items: rows });
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

// Get user's saved weekly meal plan
router.get("/me/meal-plan", auth, async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT plan_date, meal_type, recipe_id FROM meal_plans WHERE user_id = ?",
      [req.user.id]
    );
    const plan = {};
    if (Array.isArray(rows)) {
      rows.forEach(r => {
        plan[`${r.plan_date}_${r.meal_type}`] = r.recipe_id;
      });
    }
    res.json({ plan });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Save user's weekly meal plan
router.post("/me/meal-plan", auth, async (req, res) => {
  try {
    const { plan } = req.body;
    if (!plan || typeof plan !== "object") {
      return res.status(400).json({ message: "Invalid plan format" });
    }
    await db.query("DELETE FROM meal_plans WHERE user_id = ?", [req.user.id]);
    for (const [key, recipeId] of Object.entries(plan)) {
      if (!recipeId) continue;
      const parts = key.split("_");
      const planDate = parts[0];
      const mealType = parts[1] || "Meal";
      await db.query(
        "INSERT INTO meal_plans (user_id, plan_date, meal_type, recipe_id) VALUES (?, ?, ?, ?)",
        [req.user.id, planDate, mealType, Number(recipeId)]
      );
    }
    res.json({ message: "Weekly meal plan saved successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all saved meal plans (templates/previous plans) for current user
router.get("/me/saved-meal-plans", auth, async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT id, name, plan_data, created_at FROM saved_meal_plans WHERE user_id = ? ORDER BY id DESC",
      [req.user.id]
    );
    const plans = (rows || []).map(r => {
      let parsed = {};
      try {
        parsed = typeof r.plan_data === "string" ? JSON.parse(r.plan_data) : (r.plan_data || {});
      } catch (e) {
        parsed = {};
      }
      return {
        id: r.id,
        name: r.name,
        plan_data: parsed,
        created_at: r.created_at
      };
    });
    res.json(plans);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Save a meal plan as template for future reuse
router.post("/me/saved-meal-plans", auth, async (req, res) => {
  try {
    const { name, plan_data, plan, excluded, customItems } = req.body;
    let payload = plan_data;
    if (!payload) {
      payload = {
        plan: plan || {},
        excluded: excluded || [],
        customItems: customItems || []
      };
    }
    const jsonStr = typeof payload === "string" ? payload : JSON.stringify(payload);
    const planName = (name || "").trim() || `Meal Plan (${new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })})`;

    const [result] = await db.query(
      "INSERT INTO saved_meal_plans (user_id, name, plan_data) VALUES (?, ?, ?)",
      [req.user.id, planName, jsonStr]
    );
    res.status(201).json({
      message: "Meal plan saved for future reuse successfully!",
      id: result.insertId || result.lastInsertRowid
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Rename a saved meal plan
router.put("/me/saved-meal-plans/:id", auth, async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Name is required" });
    }
    await db.query(
      "UPDATE saved_meal_plans SET name = ? WHERE id = ? AND user_id = ?",
      [name.trim(), req.params.id, req.user.id]
    );
    res.json({ message: "Saved meal plan renamed successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete a saved meal plan
router.delete("/me/saved-meal-plans/:id", auth, async (req, res) => {
  try {
    await db.query(
      "DELETE FROM saved_meal_plans WHERE id = ? AND user_id = ?",
      [req.params.id, req.user.id]
    );
    res.json({ message: "Saved meal plan deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

