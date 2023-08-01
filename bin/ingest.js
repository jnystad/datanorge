const sqlite3 = require("sqlite3");
const sqlite = require("./lib/sqlite");
const fs = require("fs/promises");

const createTableSql = `
CREATE TABLE IF NOT EXISTS datasets (
  id TEXT PRIMARY KEY,
  entry_uri TEXT,
  title TEXT,
  description TEXT,
  uri TEXT,
  publisher TEXT,
  keyword TEXT,
  distribution TEXT
);
`;

const insertRecordSql = `
INSERT INTO datasets (id, entry_uri, title, description, uri, publisher, keyword, distribution)
VALUES (?, ?, ?, ?, ?, ?, json(?), json(?));
`;

async function run() {
  try {
    await fs.unlink("./db_.sqlite");
  } catch (err) {}
  try {
    await fs.unlink("./db_.sqlite-journal");
  } catch (err) {}

  console.log("Creating database...");
  const db = await sqlite.openAsync("./db_.sqlite", sqlite3.OPEN_CREATE | sqlite3.OPEN_READWRITE);

  console.log("Creating table...");
  await db.runAsync(createTableSql);

  console.log("Preparing insert statement...");
  const stmt = await db.prepareAsync(insertRecordSql);

  console.log("Inserting apis...");
  const apis = JSON.parse(await fs.readFile("./apis.json", "utf8"), "utf8");
  for (let i = 0; i < apis.length; i++) {
    const api = apis[i];
    await insert(api, stmt);
  }
  console.log(`Inserted ${apis.length} apis.`);

  console.log("Inserting datasets...");
  const datasets = JSON.parse(await fs.readFile("./datasets.json", "utf8"), "utf8");
  for (let i = 0; i < datasets.length; i++) {
    const dataset = datasets[i];
    await insert(dataset, stmt);
  }
  console.log(`Inserted ${datasets.length} apis.`);

  await stmt.finalizeAsync();

  console.log("Creating full text search table...");

  await db.runAsync(`
    CREATE VIRTUAL TABLE datasets_fts USING fts5(
      id, entry_uri, title, description, uri, publisher, keyword,
      prefix = 2
    );
  `);

  await db.runAsync(`
    INSERT INTO datasets_fts
    SELECT id, entry_uri, title, description, uri, publisher, keyword
    FROM datasets;
  `);

  await db.closeAsync();
  console.log("Swapping databases...");
  try {
    await fs.unlink("./db_old.sqlite");
  } catch (e) {}
  try {
    await fs.rename("./db.sqlite", "./db_old.sqlite");
  } catch (e) {}
  await fs.rename("./db_.sqlite", "./db.sqlite");
  console.log("Done.");
}

run();

async function insert(record, stmt) {
  await stmt.runAsync(
    record.id,
    record.entryUri,
    record.title,
    record.description,
    record.uri,
    record.publisher,
    JSON.stringify(record.keyword),
    JSON.stringify(record.distribution)
  );
}
