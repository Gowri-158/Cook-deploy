const router = require("express").Router();
const db = require("../config/db");

// 1. Get all glossary items with search & filters
router.get("/", async (req, res) => {
  try {
    const { q, category, letter } = req.query;
    let query = "SELECT * FROM glossary WHERE 1=1";
    const params = [];

    if (q && q.trim()) {
      query += " AND (term LIKE ? OR term_ta LIKE ? OR definition LIKE ? OR example LIKE ?)";
      const pattern = `%${q.trim()}%`;
      params.push(pattern, pattern, pattern, pattern);
    }

    if (category && category.trim() && category !== "All") {
      query += " AND category = ?";
      params.push(category.trim());
    }

    if (letter && letter.trim()) {
      query += " AND term LIKE ?";
      params.push(`${letter.trim()}%`);
    }

    query += " ORDER BY term ASC";

    const [rows] = await db.query(query, params);
    res.json(rows);
  } catch (err) {
    console.error("Glossary fetch error:", err);
    res.status(500).json({ message: err.message });
  }
});

// 2. Get list of categories
router.get("/categories", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT category, COUNT(*) as count FROM glossary GROUP BY category ORDER BY category ASC"
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 3. Get single glossary item
router.get("/:id", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM glossary WHERE id = ?", [req.params.id]);
    if (!rows.length) return res.status(404).json({ message: "Glossary term not found" });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 4. Add a new glossary item (user-added glossary entries)
router.post("/", async (req, res) => {
  try {
    const { term, term_ta, definition, example, category = "Technique", related_recipe_id } = req.body;

    if (!term || !term.trim()) {
      return res.status(400).json({ message: "English term name is required" });
    }
    if (!definition || !definition.trim()) {
      return res.status(400).json({ message: "Definition is required" });
    }

    const [result] = await db.query(
      `INSERT INTO glossary (term, term_ta, definition, example, category, related_recipe_id)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        term.trim(),
        (term_ta || "").trim(),
        definition.trim(),
        (example || "").trim(),
        category.trim(),
        related_recipe_id || null
      ]
    );

    const [newItem] = await db.query("SELECT * FROM glossary WHERE id = ?", [result.insertId]);

    res.status(201).json({
      message: "Glossary term added successfully!",
      item: newItem[0]
    });
  } catch (err) {
    console.error("Error adding glossary term:", err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
