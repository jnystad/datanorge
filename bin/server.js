const express = require("express");
const sqlite3 = require("sqlite3");
const sqlite = require("./lib/sqlite");
const path = require("path");
const chokidar = require("chokidar");
const fs = require("fs/promises");

const dbFilePath = process.env.DB_FILE_PATH || path.join(__dirname, "./db.sqlite");

let db;

const app = express();

app.get("/api/list", async (req, res) => {
  const { limit, offset, publisher } = req.query;
  const sql = `
    SELECT id, entry_uri, title, description, uri, publisher, keyword, distribution
    FROM datasets
    ${publisher ? "WHERE publisher = ?" : ""}
    ORDER BY publisher, title
    LIMIT ?
    OFFSET ?
  `;
  const publishersSql = `
    SELECT publisher AS name, count(*) AS count
    FROM datasets
    GROUP BY publisher
    ORDER BY 2 DESC
  `;
  try {
    const rows = await db.allAsync(
      sql,
      [publisher, parseInt(limit || "10"), parseInt(offset || "0")].filter(
        (c) => c !== undefined && c !== null && c !== ""
      )
    );
    const total = await db.getAsync("SELECT COUNT(*) AS total FROM datasets");
    const publishers = await db.allAsync(publishersSql);
    res.json({
      total: total.total,
      data: rows.map(toDataset),
      aggregations: { publishers },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/search", async (req, res) => {
  const { q, limit, offset, publisher } = req.query;
  const sql = `
    SELECT datasets.*
    FROM datasets_fts INNER JOIN datasets ON datasets_fts.id = datasets.id
    WHERE datasets_fts MATCH ? AND rank MATCH 'bm25(0.0, 0.0, 10.0, 5.0, 1.0, 2.0, 3.0)'
    ${publisher ? "AND datasets.publisher = ?" : ""}
    ORDER BY rank
    LIMIT ?
    OFFSET ?
  `;
  const totalSql = `
    SELECT COUNT(*) AS total
    FROM datasets_fts
    WHERE datasets_fts MATCH ?
    ${publisher ? "AND publisher = ?" : ""}
  `;
  const publishersSql = `
    SELECT publisher AS name, count(*) AS count
    FROM datasets_fts
    WHERE datasets_fts MATCH ?
    GROUP BY publisher
    ORDER BY 2 DESC
  `;
  try {
    let match = q;
    if (!/(\*|\sOR\s|\sAND\s|\sNOT\s)/.test(q)) {
      const terms = (q || "")
        .replace(/[^\p{L}\p{N}]/gu, " ")
        .split(/\s+/)
        .filter(Boolean);
      match = terms.length === 0 ? "_" : `(${terms.join(" ")}) OR (${terms.map((term) => term + "*").join(" ")})`;
    }
    const rows = await db.allAsync(
      sql,
      [match, publisher, parseInt(limit || "10"), parseInt(offset || "0")].filter(
        (v) => v !== undefined && v !== null && v !== ""
      )
    );
    const total = await db.getAsync(totalSql, [match, publisher]);
    const publishers = await db.allAsync(publishersSql, [match]);

    res.json({
      total: total.total,
      data: rows.map(toDataset),
      aggregations: { publishers },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/id/:id", async (req, res) => {
  const { id } = req.params;
  const sql = `
    SELECT *
    FROM datasets
    WHERE id = ?
  `;
  try {
    const row = await db.getAsync(sql, [id]);
    res.json(toDataset(row));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3001, async () => {
  const dbWatcher = chokidar.watch(dbFilePath, { awaitWriteFinish: true, ignoreInitial: true });

  try {
    db = await sqlite.openAsync(dbFilePath, sqlite3.OPEN_READONLY | sqlite3.OPEN_SHAREDCACHE);
    console.log("Database opened.");
  } catch (err) {
    console.error("Failed to open database:", err.message);
  }

  dbWatcher.on("all", async () => {
    try {
      await fs.stat(dbFilePath);
    } catch (err) {
      return;
    }

    console.log("Database changed, reopening...");
    if (db) await db.closeAsync();
    db = await sqlite.openAsync(dbFilePath, sqlite3.OPEN_READONLY | sqlite3.OPEN_SHAREDCACHE);
    console.log("Database reopened.");
  });

  console.log("Listening on http://localhost:3001");
});

function toDataset(row) {
  return {
    id: row.id,
    entryUri: row.entry_uri,
    title: row.title,
    description: row.description,
    publisher: row.publisher,
    uri: row.uri,
    keyword: JSON.parse(row.keyword),
    distribution: JSON.parse(row.distribution),
  };
}
