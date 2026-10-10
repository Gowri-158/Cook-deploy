require("dotenv").config({ path: require("path").join(__dirname, "../.env") });
const mysql = require("mysql2/promise");
const sqliteDb = require("../config/sqlite_db");

const RECIPE_VIDEOS = {
  1: [
    { title: "Authentic Chettinad Chicken Pepper Masala", url: "https://www.youtube.com/watch?v=dq3__hTaSLk" },
    { title: "Chettinad Chicken Curry Recipe", url: "https://www.youtube.com/watch?v=S374b97f0_s" },
    { title: "South Indian Chicken Chettinad", url: "https://www.youtube.com/watch?v=6J_G7mU86v8" },
    { title: "Traditional Chettinad Chicken Masala", url: "https://www.youtube.com/watch?v=R96lJ27lT7s" },
    { title: "Chettinad Chicken Gravy Restaurant Style", url: "https://www.youtube.com/watch?v=Yp69mD4Jk6U" }
  ],
  2: [
    { title: "Crispy Ghee Podi Masala Dosa Recipe", url: "https://www.youtube.com/watch?v=A4nS7oU3wGk" },
    { title: "Ghee Podi Dosa Recipe", url: "https://www.youtube.com/watch?v=Im1L7F_89Lg" },
    { title: "South Indian Podi Dosa Recipe", url: "https://www.youtube.com/watch?v=yY1t4N9Z2zE" },
    { title: "Crispy Masala Dosa Recipe", url: "https://www.youtube.com/watch?v=T_s3Ld-3xSw" },
    { title: "Restaurant Style Ghee Podi Dosa", url: "https://www.youtube.com/watch?v=kYJ5H0J4o_Q" }
  ],
  3: [
    { title: "Authentic Ambur Mutton Biryani", url: "https://www.youtube.com/watch?v=R9U0X8Zz53g" },
    { title: "Ambur Style Mutton Dum Biryani", url: "https://www.youtube.com/watch?v=F_fK3y1lKsg" },
    { title: "Traditional Ambur Biryani Recipe", url: "https://www.youtube.com/watch?v=aG3j6m1W-t0" },
    { title: "Mutton Biryani South Indian Style", url: "https://www.youtube.com/watch?v=64WkGfVlQyQ" },
    { title: "Restaurant Style Ambur Mutton Biryani", url: "https://www.youtube.com/watch?v=aX7J98YjVyo" }
  ],
  4: [
    { title: "Shahi Paneer Butter Masala", url: "https://www.youtube.com/watch?v=T9hQV22Uezw" },
    { title: "Creamy Shahi Paneer Recipe", url: "https://www.youtube.com/watch?v=WA5Wq4aLxR8" },
    { title: "Restaurant Style Shahi Paneer", url: "https://www.youtube.com/watch?v=vCDy7vjbz_M" },
    { title: "Paneer Butter Masala Recipe", url: "https://www.youtube.com/watch?v=U351n0iW3x8" },
    { title: "North Indian Shahi Paneer Recipe", url: "https://www.youtube.com/watch?v=0hYyQ_xK8eI" }
  ],
  5: [
    { title: "Village Style Drumstick Sambar", url: "https://www.youtube.com/watch?v=A2dYp1Wn-1M" },
    { title: "Drumstick Shallot Sambar", url: "https://www.youtube.com/watch?v=0k57_j-l10A" },
    { title: "Traditional South Indian Sambar", url: "https://www.youtube.com/watch?v=t_i1H4H625Q" },
    { title: "Village Style Sambar Recipe", url: "https://www.youtube.com/watch?v=l4gL7sY6gL4" },
    { title: "Murungakkai Chinna Vengayam Sambar", url: "https://www.youtube.com/watch?v=fD6v14k-e-M" }
  ],
  6: [
    { title: "Traditional Kambu Koozh", url: "https://www.youtube.com/watch?v=srM2iVzSDMA" },
    { title: "Venkatesh Bhat's Kambu Koozh", url: "https://www.youtube.com/watch?v=S2fF_c9V3s0" },
    { title: "Village Style Kambu Koozh", url: "https://www.youtube.com/watch?v=gLKw9OClaVM" },
    { title: "Traditional Pearl Millet Porridge", url: "https://www.youtube.com/watch?v=yYn92N-N-wM" },
    { title: "Probiotic Kambu Koozh Summer Drink", url: "https://www.youtube.com/watch?v=26x-W04-Q6U" }
  ]
};

function getThumbnail(url) {
  try {
    const u = new URL(url);
    const id = u.searchParams.get("v");
    if (id) return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
  } catch (e) {}
  return "";
}

async function main() {
  console.log("Syncing SQLite database...");
  const db = await sqliteDb.initSqliteDb();
  db.run(`
    CREATE TABLE IF NOT EXISTS recipe_videos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      recipe_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      video_url TEXT NOT NULL,
      thumbnail_url TEXT,
      display_order INTEGER DEFAULT 1
    );
  `);
  db.run("DELETE FROM recipe_videos;");

  for (const [recipeId, videos] of Object.entries(RECIPE_VIDEOS)) {
    const rId = Number(recipeId);
    db.run("UPDATE recipes SET video_url = ? WHERE id = ?", [videos[0].url, rId]);
    videos.forEach((v, idx) => {
      db.run(
        "INSERT INTO recipe_videos (recipe_id, title, video_url, thumbnail_url, display_order) VALUES (?, ?, ?, ?, ?)",
        [rId, v.title, v.url, getThumbnail(v.url), idx + 1]
      );
    });
  }
  sqliteDb.persistDb();
  console.log("SQLite synced with 30 YouTube videos across 6 recipes.");

  try {
    const conn = await mysql.createConnection({
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
      database: process.env.DB_NAME || "cookshare",
      port: Number(process.env.DB_PORT) || 3306,
      connectTimeout: 1500
    });
    console.log("Connected to MySQL. Updating MySQL schema and records...");
    await conn.execute(`
      CREATE TABLE IF NOT EXISTS recipe_videos (
        id INT AUTO_INCREMENT PRIMARY KEY,
        recipe_id INT NOT NULL,
        title VARCHAR(255) NOT NULL,
        video_url VARCHAR(500) NOT NULL,
        thumbnail_url VARCHAR(500),
        display_order INT DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_recipe_id (recipe_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);
    await conn.execute("DELETE FROM recipe_videos;");
    for (const [recipeId, videos] of Object.entries(RECIPE_VIDEOS)) {
      const rId = Number(recipeId);
      await conn.execute("UPDATE recipes SET video_url = ? WHERE id = ?", [videos[0].url, rId]);
      for (let i = 0; i < videos.length; i++) {
        const v = videos[i];
        await conn.execute(
          "INSERT INTO recipe_videos (recipe_id, title, video_url, thumbnail_url, display_order) VALUES (?, ?, ?, ?, ?)",
          [rId, v.title, v.url, getThumbnail(v.url), i + 1]
        );
      }
    }
    console.log("MySQL updated successfully.");
    await conn.end();
  } catch (err) {
    console.log("MySQL not reachable or skipped:", err.message);
  }
}

main().catch(err => {
  console.error("Error updating videos:", err);
  process.exit(1);
});
