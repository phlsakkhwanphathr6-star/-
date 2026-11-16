const Database = require("better-sqlite3");
const path = require("path");
const fs = require("fs");

const dataDir = path.join(__dirname, "..", "data");
fs.mkdirSync(dataDir, { recursive: true });
const db = new Database(path.join(dataDir, "tax-project.sqlite"));
db.pragma("journal_mode = WAL");
db.exec(`
CREATE TABLE IF NOT EXISTS records (
  id TEXT PRIMARY KEY,
  user_key TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  type TEXT NOT NULL CHECK(type IN ('p','c')),
  label TEXT DEFAULT '',
  income REAL NOT NULL DEFAULT 0,
  net_income REAL NOT NULL DEFAULT 0,
  tax REAL NOT NULL DEFAULT 0,
  snapshot TEXT NOT NULL DEFAULT '{}'
);
CREATE INDEX IF NOT EXISTS idx_records_user ON records(user_key);
`);
module.exports = db;
