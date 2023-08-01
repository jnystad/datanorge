const sqlite3 = require("sqlite3");
const util = require("util");

module.exports = {
  openAsync: open,
};

function open(path, mode) {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(path, mode, (err) => {
      if (err) {
        reject(err);
      } else {
        db.runAsync = util.promisify(db.run).bind(db);
        db.getAsync = util.promisify(db.get).bind(db);
        db.allAsync = util.promisify(db.all).bind(db);
        db.execAsync = util.promisify(db.exec).bind(db);
        db.closeAsync = util.promisify(db.close).bind(db);
        db.prepareAsync = prepare.bind(db);
        resolve(db);
      }
    });
  });
}

function prepare(sql) {
  return new Promise((resolve, reject) => {
    this.prepare(sql, function (err) {
      if (err) {
        reject(err);
      } else {
        const stmt = this;
        stmt.runAsync = util.promisify(stmt.run).bind(stmt);
        stmt.getAsync = util.promisify(stmt.get).bind(stmt);
        stmt.allAsync = util.promisify(stmt.all).bind(stmt);
        stmt.finalizeAsync = util.promisify(stmt.finalize).bind(stmt);
        resolve(stmt);
      }
    });
  });
}
