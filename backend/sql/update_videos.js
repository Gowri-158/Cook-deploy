require("dotenv").config({ path: require("path").join(__dirname, "../.env") });
const mysql = require("mysql2/promise");

async function main() {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "cookshare",
    port: Number(process.env.DB_PORT) || 3306
  });

  const updates = [
    { title: "%Chettinad Chicken%", url: "https://www.youtube.com/watch?v=dq3__hTaSLk" },
    { title: "%Ghee Podi Masala Dosa%", url: "https://www.youtube.com/results?search_query=Crispy+Ghee+Podi+Masala+Dosa+Recipe" },
    { title: "%Ambur Mutton Dum Biryani%", url: "https://www.youtube.com/results?search_query=Royal+Ambur+Mutton+Dum+Biryani+Recipe" },
    { title: "%Shahi Paneer Butter Masala%", url: "https://www.youtube.com/results?search_query=Creamy+Shahi+Paneer+Butter+Masala+Recipe" },
    { title: "%Drumstick & Shallot Sambar%", url: "https://www.youtube.com/results?search_query=Village+Drumstick+Shallot+Sambar+Recipe" },
    { title: "%Kambu Koozh%", url: "https://www.youtube.com/watch?v=srM2iVzSDMA" }
  ];

  for (const item of updates) {
    const [res] = await conn.execute("UPDATE recipes SET video_url = ? WHERE title LIKE ?", [item.url, item.title]);
    console.log(`Updated ${item.title}: ${res.affectedRows} row(s)`);
  }

  const [rows] = await conn.execute("SELECT id, title, cuisine, difficulty, prep_minutes, cook_minutes, servings, video_url FROM recipes ORDER BY id");
  console.log("Current DB Recipes & Videos:");
  console.table(rows);
  await conn.end();
}

main().catch(err => {
  console.error("Error updating videos:", err);
  process.exit(1);
});
