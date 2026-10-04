const mysql = require("mysql2/promise");
const sqliteDb = require("./sqlite_db");

let mysqlPool = null;
let useSqlite = false;
let connectionTested = false;

function getMysqlPool() {
  if (!mysqlPool) {
    mysqlPool = mysql.createPool({
      host: process.env.DB_HOST || "localhost",
      port: Number(process.env.DB_PORT) || 3306,
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
      database: process.env.DB_NAME || "cookshare",
      waitForConnections: true,
      connectionLimit: 10,
      connectTimeout: 2000
    });
  }
  return mysqlPool;
}

const db = {
  async query(sql, params = []) {
    if (!useSqlite && !connectionTested) {
      try {
        const pool = getMysqlPool();
        // Test with a quick query
        const testConn = await Promise.race([
          pool.query("SELECT 1"),
          new Promise((_, reject) => setTimeout(() => reject(new Error("MySQL connection timeout")), 1500))
        ]);
        connectionTested = true;
        console.log("Connected to MySQL database successfully.");
      } catch (err) {
        useSqlite = true;
        connectionTested = true;
        console.log(`[CookShare DB] MySQL unreachable (${err.code || err.message}). Activated embedded SQLite database engine.`);
      }
    }

    if (useSqlite) {
      return sqliteDb.query(sql, params);
    }

    try {
      return await getMysqlPool().query(sql, params);
    } catch (err) {
      // If MySQL fails mid-way, fallback to SQLite
      if (err.code === "ECONNREFUSED" || err.code === "PROTOCOL_CONNECTION_LOST") {
        console.warn("[CookShare DB] MySQL connection lost. Falling back to embedded SQLite.");
        useSqlite = true;
        return sqliteDb.query(sql, params);
      }
      throw err;
    }
  },

  // Helper to force engine if needed
  useSqliteEngine() {
    useSqlite = true;
    connectionTested = true;
  }
};

module.exports = db;
